const express = require('express');
const User = require('../database/table/user');
const Account = require('./../database/table/account');
const Role = require('./../database/table/role');
const Member = require('./../database/table/member');

const create = async function (req, res) {
    if (!req.body.username){ 
        res.status(400).send({"message":"Không được bỏ trống tài khoản đăng nhập."});
        return;
    }
    if (!req.body.password){
        res.status(400).send({"message":"Không được bỏ trống mật khẩu đăng nhập."});
        return;
    }
    if (!req.body.fullname){
        res.status(400).send({"message":"Không được bỏ trống họ và tên."});
        return;
    }
    if (!req.body.mail){
        res.status(400).send({"message":"Không được bỏ trống địa chỉ mail."});
        return;
    }
    await Account.findOne({username: req.body.username}, async function(err, account) {
        if (err) {
              console.loh(err);
        }
        else{
            if (account){
                res.status(400).send({"message":"Tài khoản đăng nhập đã tồn tại."});
                return;
            }
        }
        }
    )
    let account = new Account(req.body);
    if (!req.body.idRole) {
        Role.findOne({name: 'Thành viên'}, function (err, role) {
           if (err) {
                res.status(400).send({"message":"Không có chức vụ thành viên trong cơ sỡ dự liệu."});
                return;
           } else {
               if (!role) {
                    res.status(400).send({"message":"Không có chức vụ thành viên trong cơ sỡ dự liệu."});
                    return;
               } else {
                    account.idRole = role._id;
                    account.save()
                    .then(account => {
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
                            .then(user =>{
                                let member = new Member(req.body);
                                member.idUser = user._id;
                                member.save()
                                    .then(member =>{
                                        res.status(200).json({"_id": member._id, "message": "Tạo thành công."});
                                    })
                                    .catch(err => {
                                        res.status(400).send({"message":"Tạo không thành công.", "error":"Lỗi lưu thành viên."});
                                        console.log(err);
                                    });
                            })
                            .catch(err => {
                                res.status(400).send({"message":"Tạo không thành công.", "error":"Lỗi lưu thông tin thành viên."});
                                console.log(err);
                            });
                    })
                    .catch(err => {
                        res.status(400).send({"message":"Tạo không thành công.", "error":"Lỗi lưu thông tin tài khoản."});
                        console.log(err);
                    });
               }
           }
        })
    }
}


const createByAdmin = async function (req, res) {
    if (!req.body.username){ 
        res.status(400).send({"message":"Username is require"});
        return;
    }else if (!req.body.password){
        res.status(400).send({"message":"Password is require"});
        return;
    }
    await Account.findOne({username: req.body.username}, async function(err, account) {
        if (err) {
              console.loh(err);
        }
        else{
            if (account){
                res.status(400).send({"message":"Username already exists"});
                return;
            }
        }
        }
    )
    let account = new Account(req.body);
    account.save()
        .then(account => {
            res.status(200).json({"message": "create successfully"});
        })
        .catch(err => {
            res.status(400).send({"message":"unable to save to database"});
            console.log(err);
        });
}


const getAll = function (req, res) {
    Account.find(function(err, accounts){
        if(err){
            res.status(400).send({"message":"fail to get"});
            console.log(err);
        }
        else {
            res.status(200).json(accounts);
        }
    }).populate('idRole');
}

const getOneById = function (req, res) {
    let id = req.params.id;
    Account.findById(id, function (err, account){
        if (!account){
            res.status(400).send({"message":"data is not found"});
            console.log(err);
        }
        else {
            res.status(200).json(account);
        }
    }).populate('idRole');
}

const updateById = function (req, res) {
    console.log(req.body);
    Account.findById(req.params.id, function(err, account) {
        if (!account){
            res.status(400).send({"message":"Sai định dạng Id-Account."});
            console.log(err);
        }
        else {
            if (!account) {
                res.status(400).send({"message":"Tài khoản không tồn tại."});
                return;
            } else {
                if (!req.body.username) {
                    res.status(400).send({"message":"Không thể bỏ trống tài khoản."});
                    return;
                } else if (!req.body.password) {
                    res.status(400).send({"message":"Không thể bỏ trống mật khẩu."});
                    return;
                }
                account.username = req.body.username;
                account.password = req.body.password;
                account.idRole = req.body.idRole;
                account
                    .save()
                    .then(business => {
                        res.status(200).json({"message":"Sửa thành công."});
                        return;
                    })
                    .catch(err => {
                        res.status(400).send({"message":"Sửa không thành công."});
                        console.log(err);
                        return;
                    });
            }
        }
    });
}

const deleteById = function (req, res) {
    Account.findById({_id: req.params.id}, function(err, account){
        if(err){
            res.status(400).send({"message":"Tài khoản không tồn tại."});
            console.log(err);
            return;
        }
        else{
            if (account.username == "admin") {
                console.log(err);
                return res.status(400).send({"message":"Không thể xóa Admin."});
            }
            if (!account) {
                res.status(400).send({"message":"Tài khoản không tồn tại."});
                console.log(err);
                return;
            } else {
                User.findOne({idAccount: account._id}, function (err, user) {
                    if(err){
                        res.status(400).send({"message":"không tồn tại thông tin người dùng."});
                        console.log(err);
                        return;
                    }
                    else{
                        if (user) {
                            res.status(400).send({"message":"Không thể xóa tài khoản khi tồn tại thông tin người dùng."});
                            console.log(err);
                            return;
                        } else {
                            account.remove();
                            res.status(200).json({"message":"Xóa thành công."});
                            return;
                        }
                    }
                })
                
            }
        }
    });
}

module.exports = {
    create,
    getAll,
    getOneById,
    updateById,
    deleteById,
    createByAdmin
};
