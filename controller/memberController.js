const express = require('express');
const User = require('./../database/table/user');
const Member = require('./../database/table/member');
const Account = require('./../database/table/account');
const Booking = require('./../database/table/booking');

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const create = async function(req, res) {
    if (!req.body.fullname) {
        res.status(400).send({ "message": "Không thể bỏ trống tên!" });
        return;
    } 
    let user = new User(req.body);
    if (!req.body.avatar) {
        if (req.body.gender == 'Nam') {
            user.avatar = "https://imagebucketkhambenhonl-1.s3-ap-southeast-1.amazonaws.com/man.png"
        }
        if (req.body.gender == 'Nữ') {
            user.avatar = "https://imagebucketkhambenhonl-1.s3-ap-southeast-1.amazonaws.com/woman.png"
        }
    }
    user.save()
        .then(user => {
            const member = new Member();
            member.idUser = user._id;
            member.save().then(member => {
                    res.status(200).json({ "message": "Tạo thành công" });
                })
                .catch(err => {
                    res.status(400).send({ "message": "Không thành công!" });
                    console.log(err);
                })
        })
        .catch(err => {
            res.status(400).send({ "message": "Không thành công!" });
            console.log(err);
        });
}


const createByAdmin = async (req, res) => {
    if (!req.body.fullname) {
        res.status(400).send({ "message": "Không thể bỏ trống tên" });
        return;
    }else if (!req.body.username){
        res.status(400).send({"message":"Không thể để trống tài khoản!"});
        return;
    }
    else if (!req.body.password){
        res.status(400).send({"message":"Không thể để trống mật khẩu"});
        return;
    }
    await Account.findOne({username: req.body.username},function(err, account) {
        if (err) {
              console.loh(err);
        }
        else{
            if (account){
                res.status(400).send({"message":"Username already exists"});
                return;
            }
        }
    })
    let account = new Account(req.body);
    account.save()
        .then(account=>{
            let user = new User(req.body);
            if (!req.body.avatar) {
                if (req.body.gender == 'Nam') {
                    user.avatar = "https://imagebucketkhambenhonl-1.s3-ap-southeast-1.amazonaws.com/man.png"
                }
                if (req.body.gender == 'Nữ') {
                    user.avatar = "https://imagebucketkhambenhonl-1.s3-ap-southeast-1.amazonaws.com/woman.png"
                }
            }
            user.idAccount = account._id;
            user.save()
                .then(user => {
                    const member = new Member();
                    member.idUser = user._id;
                    member.save().then(member => {
                            res.status(200).json({ "message": "Tạo thành công" });
                        })
                        .catch(err => {
                            res.status(400).send({ "message": "Không thành công!" });
                            account.remove();
                            user.remove();
                            console.log(err);
                            return;
                        })
                })
                .catch(err => {
                    account.remove();
                    res.status(400).send({ "message": "Không thành công!" });
                    console.log(err);
                    return;
                });
        } )
        .catch(err =>{
            res.status(400).send({ "message": "Không thành công!" });
            console.log(err);
            return;
        })
   
}

const updateByIdByAdmin = function(req, res){
    Member.findById(req.params.id, async function(err, member) {
        if (!member) {
            res.status(400).send({ "message": "Data is not found" });
            console.log(err);
        } else {
            User.findById(member.idUser, async function(err, user) {
                user.fullname = req.body.fullname;
                user.address = req.body.address;
                user.phoneNumber = req.body.phoneNumber;
                user.avatar = req.body.avatar
                user.mail = req.body.mail;
                user.gender = req.body.gender;
                Account.findOne({username: req.body.username}, (err , acc)=>{
                    if (err) {
                        res.status(400).send({ "message": "Data is not found" });
                        console.log(err);
                        return;
                    } else {
                        if (acc && ((acc._id > user.idAccount) || (acc._id < user.idAccount))) {
                            res.status(400).send({ "message": "Tài khoản đã tồn tại" });
                            console.log(err);
                            return;
                        }else{
                            Account. findById(user.idAccount, (err , acc)=>{
                                if (err) {
                                    res.status(400).send({ "message": "Data is not found" });
                                    console.log(err);
                                } else {
                                    acc.username = req.body.username;
                                    acc.password = req.body.password;
                                    acc.save()
                                        .then(async acc =>{
                                            user.save()
                                                .then(user => {
                                                    res.status(200).json('Update complete');
                                                })
                                                .catch(err => {
                                                    res.status(400).send({ "message": "unable to update the database" });
                                                    console.log(err);
                                                });
                                        })
                                        .catch(err => {
                                            res.status(400).send({ "message": "unable to update the database" });
                                            console.log(err);
                                        });
                                    }
                              });
                            }
                        }
                    });
                });
            }
    });
}


const getOneById = function(req, res) {
    let id = req.params.id;
    Member.findById(id, async function(err, member) {
        if (!member) {
            res.status(400).send({ "message": "data is not found" });
            console.log(err);
        } else {
            res.status(200).json(member);
        }
    }).populate({ path: 'idUser',  populate:{ path:'idAccount' , populate: { path: 'idRole'}}});
}

const getAll = function(req, res) {
    Member.find(async function(err, members) {
        if (err) {
            res.status(400).send({ "message": "fail to get" });
            console.log(err);
        } else {
            res.status(200).json(members);
        }
    }).populate({ path: 'idUser',  populate:{ path:'idAccount' , populate: { path: 'idRole'}}})
    .sort({idUser:1});
}


const updateById = function(req, res) {
    Member.findById(req.params.id, async function(err, member) {
        if (!member) {
            res.status(400).send({ "message": "Data is not found" });
            console.log(err);
        } else {
            User.findById(member.idUser, async function(err, user) {
                if (!req.body.fullname) {
                    res.status(400).send({ "message": "user full name is require" });
                    return;
                }
                user.fullname = req.body.fullname;
                user.address = req.body.address;
                user.phoneNumber = req.body.phoneNumber;
                user.avatar = req.body.avatar
                user.mail = req.body.mail;
                user.gender = req.body.gender;
                user.save().then(user => {
                        res.status(200).json('Update complete');
                    })
                    .catch(err => {
                        res.status(400).send({ "message": "unable to update the database" });
                        console.log(err);
                    });
            });
        }
    });
}

const deleteById = function(req, res) {
    Member.findById({ _id: req.params.id }, function(err, member) {
        if (err) {
            res.status(400).send({ "message": "Sai định dạng mã thành viên." });
            console.log(err);
            return;
        } else {
            if (!member) {
                res.status(400).send({ "message": "Không tìm thấy thành viên." });
                console.log(err);
                return;
            } else {
                Booking.findOne({idMember: member._id}, function (err, booking) {
                    if (err) {
                        res.status(400).send({ "message": "Sai định dạng mã thành viên." });
                        console.log(err);
                        return;
                    } else {
                        if (booking) {
                            res.status(400).send({ "message": "Không thể xóa thành viên đã có lịch hẹn." });
                            console.log(err);
                            return;
                        } else {
                            User.findById({ _id: member.idUser }, function(err, user) {
                                if (err) {
                                    res.status(400).send({ "message": "Lỗi không tìm thấy thông tin thành viên" });
                                    console.log(err);
                                    return;
                                } else {
                                    if (!user) {
                                        res.status(400).send({ "message": "Lỗi không tìm thấy thông tin thành viên" });
                                        console.log(err);
                                        return;
                                    } else {
                                        Account.findById(user.idAccount, function (err, acc) {
                                            if (err) {
                                                res.status(400).send({ "message": "Lỗi không tìm thấy thông tin tài khoản" });
                                                console.log(err);
                                                return;
                                            } else {
                                                if (!acc) {
                                                    res.status(400).send({ "message": "Lỗi không tìm thấy thông tin tài khoản" });
                                                    console.log(err);
                                                    return;
                                                } else {
                                                    acc.remove().then(a=>{
                                                        user.remove().then(u =>{
                                                            member.remove().then(m =>{
                                                                res.status(200).json({ "message": "Successfully removed" });
                                                                return;
                                                            });
                                                        });
                                                    });
                                                }
                                            }
                                        })
                                       
                                    }
                                }
                            });
                        }
                    }
                })
            }
        }
    });
}

module.exports = {
    createByAdmin,
    create,
    getAll,
    getOneById,
    updateById,
    deleteById,
    updateByIdByAdmin
};