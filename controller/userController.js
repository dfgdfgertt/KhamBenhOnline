const express = require('express');
const Account = require('./../database/table/account');
const Role = require('./../database/table/role');
const User = require('./../database/table/user');
const UploadImage = require('./upload');

const create = async function(req, res) {
    if (!req.body.fullname) {
        res.status(400).send({ "message": "Full name is require" });
        return;
    } else if (!req.body.idRole != null) {
        let role = Role.findById(req.body.idRole);
        if (!role) {
            res.status(400).send({ "message": "Role not found" });
            return;
        }
    } else if (!req.body.idAccount != null) {
        let account = Account.findById(req.body.idAccount)
        if (!account) {
            res.status(400).send({ "message": "Account not found" });
            return;
        }
    }
    let user = new User(req.body);
    // if(req.body.avatar){
    //     let image = await UploadImage.uploadFile(req.body.avatar);
    //     user.avatar = image.Location;
    // }
    user.save()
        .then(user => {
            res.status(200).json({ "message": 'create successfully' });
            return user.id;
        })
        .catch(err => {
            res.status(400).send({ "message": "unable to save to database" });
            console.log(err);
        });
}

const createByAdmin = (req, res) => {
    if (!req.body.fullname) {
        res.status(400).send({ "message": "Không thể bỏ trống tên" });
        return;
    } else if (!req.body.idRole != null) {
        let role = Role.findById(req.body.idRole);
        if (!role) {
            res.status(400).send({ "message": "Chức vụ không tồn tại!" });
            return;
        }
    }
    let user = new User(req.body);
    user.save()
        .then(user => {
            res.status(200).json({ "message": 'create successfully' });
            return user.id;
        })
        .catch(err => {
            res.status(400).send({ "message": "unable to save to database" });
            console.log(err);
        });
}

const getAll = function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.status(400).send({ "message": "fail to get" });
            console.log(err);
        } else {
            res.status(200).json(users);
            return users;
        }
    });
}

const getOneById = function(req, res) {
    let id = req.params.id;
    User.findById(id, function(err, user) {
        if (!user) {
            res.status(400).send({ "message": "data is not found" });
            console.log(err);
        } else {
            res.status(200).json(user);
        }
    });
}

const updateById = function(req, res) {
    User.findById(req.params.id, async function(err, user) {
        if (!user) {
            res.status(400).send({ "message": "Data is not found" });
            console.log(err);
        } else {
            if (!req.body.fullname) {
                res.status(400).send({ "message": "user full name is require" });
                return;
            } else if (!req.body.idRole != null) {
                let role = Role.findById(req.body.idRole);
                if (!role) {
                    res.status(400).send({ "message": "Role not found" });
                    return;
                }
            } else if (!req.body.idAccount != null) {
                let account = Account.findById(req.body.idAccount)
                if (!account) {
                    res.status(400).send({ "message": "Account not found" });
                    return;
                }
            }
            // if(req.body.avatar != null){
            //     let image = await UploadImage.uploadFile(req.body.avatar);
            //     user.avatar = image.Location;
            // }
            user.avatar = req.body.avatar;
            user.fullname = req.body.fullname;
            user.address = req.body.address;
            user.phoneNumber = req.body.phoneNumber;
            user.mail = req.body.mail;
            user.idAccount = req.body.idAccount;
            user.idRole = req.body.idRole;
            user.save().then(user => {
                    res.status(200).json({ "message": "Update complete" });
                })
                .catch(err => {
                    res.status(400).send({ "message": "unable to update the database" });
                    console.log(err);
                });
        }
    });
}

const deleteById = function(req, res) {
    User.findByIdAndRemove({ _id: req.params.id }, function(err, user) {
        if (err) {
            res.status(400).send({ "message": "Data is not found" });
            console.log(err);
        } else {
            res.status(200).json({ "message": "Successfully removed" });
        }
    });
}

module.exports = {
    create,
    getAll,
    getOneById,
    updateById,
    deleteById
};