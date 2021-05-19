const express = require('express');
const Account = require('./../database/table/account');
const Role = require('./../database/table/role');
const User = require('./../database/table/user');
const Member = require('./../database/table/member');
const Doctor = require('./../database/table/doctor');
const SendMail = require('./emailController');


const admin = function (res){
    res.status(200).json({"admin": "Tui là admin :D"});
    return;
}

const doctorlogin = function (idAccount , res){
    User.findOne({idAccount:idAccount }, function(err, user){
        if (err) {
            console.log(err);
            res.status(400).send({"message":"Đăng nhập không thành công."});
            return;
        }else{
            Doctor.findOne({idUser: user._id },function(err, doctor){
                if (err) {
                    console.log(err);
                    res.status(400).send({"message":"Đăng nhập không thành công."});
                    return;
                }else {
                    if (!doctor) {
                        console.log(err);
                        res.status(400).send({"message":"Đăng nhập không thành công."});
                        return;
                    } else {
                        res.status(200).json(doctor);
                        return;
                    }
                }
            })
            .populate('idFaculty')
            .populate({ path: 'idUser',  populate:{ path:'idAccount' , populate: { path: 'idRole'}}});
        }
    });
}

const memberlogin = function (idAccount , res){
    User.findOne({idAccount:idAccount }, function(err, user){
        if (err) {
            console.log(err);
            res.status(400).send({"message":"Đăng nhập không thành công."});
            return;
        }else{
        Member.findOne({idUser:user._id} , function(err, member){
            if (err) {
                console.log(err);
                res.status(400).send({"message":"Đăng nhập không thành công."});
                return;
            }else{
                if (!member) {
                    console.log(err);
                    res.status(400).send({"message":"Đăng nhập không thành công."});
                    return;
                } else {
                    res.status(200).json(member);
                    return;
                }
            };
        }).populate({ path: 'idUser',  populate:{ path:'idAccount' , populate: { path: 'idRole'}}});
    };
    });
}

const login = async function (req, res){
    await Account.findOne({username: req.body.username}, async function(err, account) {
        if (err) {
            res.status(400).send({"message":"Sai thông tin đăng nhập."});
            console.log(err);
            return;
        }
        else{
            if (!account){
                res.status(400).send({"message":"Sai thông tin đăng nhập."});
                return;
            }else{
                if (account.password != req.body.password) {
                    res.status(400).send({"message":"Sai thông tin đăng nhập."});
                return;
                }else{
                    switch (account.idRole.name) {
                        case 'Admin': admin(res);
                            break;
                        case 'Doctor': 
                            doctorlogin(account._id, res);
                            break;
                        case 'Member': 
                            memberlogin(account._id, res);
                            break;
                        case 'Bác sĩ': 
                            doctorlogin(account._id, res);
                            break;
                        case 'Thành viên': 
                            memberlogin(account._id, res);
                            break;
                        case 'Bac si': 
                            doctorlogin(account._id, res);
                            break;
                        case 'Thanh vien': 
                            memberlogin(account._id, res);
                            break;
                        default:
                            res.status(400).send({"message":"Không tồn tại chức vụ trong hệ thống"});
                            break;
                    }
                }
            }
        }
    }).populate('idRole');
}

const loginGGAccount = function (req, res) {
    if (!req.body.googleId) {
        res.status(400).send({"message":"Thiếu google-Id"});
        console.log(err);
        return;
    }
    if (!req.body.fullname) {
        res.status(400).send({"message":"Thiếu tên người dùng"});
        console.log(err);
        return;
    }
    Account.findOne({username: req.body.googleId}, function (err, account) {
        if (err) {
            res.status(400).send({"message":"Có lỗi trong lúc đăng nhập"});
            console.log(err);
            return;
        } else {
            if (account) {
                memberlogin(account._id, res);
            } else {
                let acc = new Account();
                if (!req.body.idRole) {
                    Role.findOne({name: 'Thành viên'}, function (err, role) {
                       if (err) {
                            res.status(400).send({"message":"Không có chức vụ thành viên trong cơ sỡ dự liệu"});
                            return;
                       } else {
                           if (!role) {
                                res.status(400).send({"message":"Không có chức vụ thành viên trong cơ sỡ dự liệu"});
                                return;
                           } else {
                                acc.username = req.body.googleId;
                                acc.password = req.body.googleId;
                                acc.idRole = role._id;
                                acc.save()
                                .then(acc => {
                                    let user = new User(req.body);
                                    user.idAccount = acc._id;
                                    user.save()
                                        .then(user =>{
                                            let member = new Member();
                                            member.idUser = user._id;
                                            member.save()
                                                .then(member =>{
                                                    Member.findOne({idUser:user._id} , function(err, member){
                                                        if (err) {
                                                            console.log(err);
                                                            res.status(400).send({"message":"Đăng nhập không thành công."});
                                                            return;
                                                        } else {
                                                            if (!member) {
                                                                console.log(err);
                                                                res.status(400).send({"message":"Đăng nhập không thành công."});
                                                                return;
                                                            } else {
                                                                res.status(200).json(member);
                                                                return;
                                                            }
                                                        }
                                                    }).populate({ path: 'idUser',  populate:{ path:'idAccount' , populate: { path: 'idRole'}}})
                                                })
                                                .catch(err => {
                                                    res.status(400).send({"message":"unable to save to database"});
                                                    console.log(err);
                                                    return;
                                                });
                                        })
                                        .catch(err => {
                                            res.status(400).send({"message":"unable to save to database"});
                                            console.log(err);
                                            return;
                                        });
                                })
                                .catch(err => {
                                    res.status(400).send({"message":"unable to save to database"});
                                    console.log(err);
                                    return;
                                });
                           }
                       }
                    })
                }
            }
        }
    })
}


const changePassword = function(req, res){
    if (!req.body.password){
        res.status(400).send({"message":"Please! input password"});
        return;
    }else if (!req.body.newpassword){
        res.status(400).send({"message":"Please! input new password"});
        return;
    }
    Account.findOne({_id: req.params.id},  async function(err, account){
        if (err) {
            res.status(400).send({"message":"Account not found"});
            console.log(err);
            return;
        } else {
            if (account.password != req.body.password) {
                res.status(400).send({"message":"Password incorrect"});
            } else {
                account.password = req.body.newpassword;
                account.save().then(acc =>{
                    res.status(400).send({"message":"Change password is successfully"});
                    return;
                }).catch(err => {
                    res.status(400).send({"message":"unable to Change password"});
                    console.log(err);
                });
            }
        }
    });
}

const forgotpasswordOTP = async function (req, res){
    if (!req.body.username){
        res.status(400).send({"message":"Hãy nhập tài khoản đăng nhập của bạn."});
        return;
    }
    if (!req.body.mail){
        res.status(400).send({"message":"Hãy nhập địa chỉ mail đăng nhập của bạn."});
        return;
    }
    await Account.findOne({username: req.body.username}, async function(err, account) {
        if (err) {
              console.loh(err);
        }
        else{
            if (!account){
                res.status(400).send({"message":"Không đúng tài khoản đăng nhập."});
                return;
            }else{
                User.findOne({$and:[{idAccount:account._id,mail:req.body.mail}]}, async function(err, user){
                    if (err) {
                        console.log(err);
                        res.status(400).send({"message":"sai định dạng Id-Account hoặc mail"});
                        return;
                    } else {
                        if (!user){
                            res.status(400).send({"message":"Không tồn tại người dùng"});
                            return;
                        }else{
                            let otp = Math.floor(Math.random() * (999999 - 123456) ) + 123456;
                            await SendMail.senMailForgotPasswork(otp, req.body.mail);
                            newjson= {
                                "messege": "Gửi mã OTP thành công. Vui lòng kiểm tra mail để xác thực.",
                                "otp": otp,
                                "idAccount": account._id
                            };
                            res.status(200).json(newjson);
                            //res.status(200).send(newjson);
                            return;
                        }
                    }
                } )
            }
        }
    });
}

const changepasswordforgot =  function (req, res){
    if (!req.body.newpassword){
        res.status(400).send("Xin vui lòng nhập mật khẩu mới.");
        return;
    }
    Account.findById(req.params.id,function (err, account){ 
       if (err) {
        res.status(400).send("Sai định dạng Id tài khoản.");
        return;
       } else {
           account.password = req.body.newpassword;
           account.save().then(acc =>{
                res.status(200).send("Đặt mật khẩu mới thành công.");
                return;
           }).catch(err =>{
               console.log(err);
            res.status(400).send("Không thể đặt lại mật khẩu.");
            return;
           })
       }
    })
}


module.exports = {
    login,
    changePassword,
    forgotpasswordOTP,
    changepasswordforgot,
    loginGGAccount
};

