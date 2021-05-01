const express = require('express');
const Account = require('./../database/table/account');
const Role = require('./../database/table/role');
const User = require('./../database/table/user');
const Member = require('./../database/table/member');
const Doctor = require('./../database/table/doctor');

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

const admin = function (res){
    newjson1 = [{"admin": "Tao là admin ý kiến cc :D"}];
    newjson = [
        {
            "_id": "admin",
            "fullname": "admin",
            "avatar": "admin",
            "address": "admin",
            "phoneNumber": "admin",
            "mail": "admin",
            "nickname": "admin",
            "image": "admin",
            "trainingPlaces": "admin",
            "degree": "admin",
            "description": "admin",
            "specialist": "admin",
            "workingProcess": "admin",
            "Faculty": "admin",
            "Role": "admin",
            "idAccount": "admin",
            "listDiagnostic": "admin"
        }
    ];
    res.status(200).json(newjson1);
}

const doctorlogin = function (idAccount , res){
    User.findOne({idAccount:idAccount }, function(err, user){
        if (err) {
            console.log(err);
            res.status(400).send("Login is unsuccessfully");
        }else{
            Doctor.findOne({idUser:user._id },function(err, doctor){
                if (err) {
                    console.log(err);
                    res.status(400).send("Login is unsuccessfully");
                }else {
                    newjson = [
                        {
                            "_id": doctor._id,
                            "fullname": user.fullname,
                            "avatar": user.avatar,
                            "address": user.address,
                            "phoneNumber": user.phoneNumber,
                            "mail": user.mail,
                            "nickname": doctor.name,
                            "image": doctor.image,
                            "trainingPlaces": doctor.trainingPlaces,
                            "degree": doctor.degree,
                            "description": doctor.description,
                            "specialist": doctor.specialist,
                            "workingProcess": doctor.workingProcess,
                            "Faculty": doctor.idFaculty,
                            "Role": user.idRole.name,
                            "idAccount": user.idAccount,
                            "listDiagnostic": doctor.listDiagnostic
                        }
                    ];
                    res.status(200).json(newjson);
                }
            }).populate('idFaculty').populate('listDiagnostic');
        }
    }).populate('idAccount').populate('idRole');
}

const memberlogin = function (idAccount , res){
    User.findOne({idAccount:idAccount }, function(err, user){
        if (err) {
            console.log(err);
            res.status(400).send("Login is unsuccessfully");
        }else{
        Member.findOne({idUser:user._id} , function(err, member){
            if (err) {
                console.log(err);
                res.status(400).send("Login is unsuccessfully");
            }else{
                json =
                {
                    "_id": member._id,
                    "fullname": user.fullname,
                    "avatar": user.avatar,
                    "address": user.address,
                    "phoneNumber": user.phoneNumber,
                    "mail": user.mail,
                    "Role": user.idRole.name,
                    "idAccount": user.idAccount
                };
                res.status(200).json(json);
            };
        });
    };
    }).populate('idRole').populate('idAccount');
}

const login = async function (req, res){
    await Account.findOne({username: req.body.username}, async function(err, account) {
        if (err) {
              console.loh(err);
        }
        else{
            if (!account){
                res.status(400).send("The account is not registered");
                return;
            }else{
                if (account.password != req.body.password) {
                    res.status(400).send("Password is not correct");
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
                        default:
                            res.status(400).send("Login is unsuccessfully");
                            break;
                    }
                }
            }
        }
    }).populate('idRole');
}


const changePassword = function(req, res){
    if (!req.body.password){
        res.status(400).send("Please! input password");
        return;
    }else if (!req.body.newpassword){
        res.status(400).send("Please! input new password");
        return;
    }
    Account.findOne({_id: req.params.id},  async function(err, account){
        if (err) {
            res.status(400).send("Account not found");
            console.log(err);
            return;
        } else {
            if (account.password != req.body.password) {
                res.status(400).send("Password incorrect");
            } else {
                account.password = req.body.newpassword;
                account.save().then(acc =>{
                    res.status(400).send("Change password is successfully");
                    return;
                }).catch(err => {
                    res.status(400).send("unable to Change password");
                    console.log(err);
                });
            }
        }
    });
}

const forgotpassword = async function (req, res){
    await Account.findOne({username: req.body.username}, async function(err, account) {
        if (err) {
              console.loh(err);
        }
        else{
            if (!account){
                res.status(400).send("The account is not registered");
                return;
            }else{
                if (!req.body.forgot){
                    res.status(400).send("Please! input email or phoneNumber");
                    return;
                }
                await User.findOne({idAccount:account._id}, function(err, user){
                    if (err) {
                        console.log(err);
                        res.status(400).send("fail to forgot");
                        return;
                    } else {
                        if (!user){
                            res.status(400).send("The user not found");
                            return;
                        }else{
                            newjson= [{
                                "messege": "data is correct, input new password",
                                "idAccount": account._id
                            }];
                            res.status(200).send(newjson);
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
        res.status(400).send("Please! input new password");
        return;
    }
    Account.findById(req.params.id,function (err, account){ 
       if (err) {
        res.status(400).send("fail to forgot password");
        return;
       } else {
           account.password = req.body.newpassword;
           account.save().then(acc =>{
                res.status(200).send("Forgot is successfullt");
                return;
           }).catch(err =>{
               console.log(err);
            res.status(400).send("fail to forgot password");
            return;
           })
       }
    })
}


module.exports = {
    login,
    changePassword,
    forgotpassword,
    changepasswordforgot
};

