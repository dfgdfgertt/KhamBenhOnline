const express = require('express');
const Account = require('./../database/table/account');
const Role = require('./../database/table/role');
const User = require('./../database/table/user');
const UploadImage = require('./upload');

const create = async function (req, res) {
    if (!req.body.fullname ){ 
        res.status(400).send("Full name is require");
        return;
    }else if (!req.body.idRole != null){
       let role = Role.findById(req.body.idRole);
       if(!role){
        res.status(400).send("Role not found");
        return;
       }
    }else if (!req.body.idAccount != null){
        let account = Account.findById(req.body.idAccount)
        if (!account){
            res.status(400).send("Account not found");
            return;
        }
    }
    let user = new User(req.body);
    if(req.body.avatar != null){
        let image = await UploadImage.uploadFile(req.body.avatar);
        user.avatar = image.Location;
    }
    user.save()
        .then(user => {
            res.status(200).json({'user': 'create successfully'});
            return user.id;
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
            console.log(err);
        });
}

const getAll = function (req, res) {
    User.find(function(err, users){
        if(err){
            res.status(400).send("fail to get");
            console.log(err);
        }
        else {
            res.status(200).json(users);
            return users;
        }
    });
}

const getOneById = function (req, res) {
    let id = req.params.id;
    User.findById(id, function (err, user){
        if (!user){
            res.status(404).send("data is not found");
            console.log(err);
        }
        else {
            res.status(200).json(user);
        }
    });
}

const updateById = function (req, res) {
    User.findById(req.params.id, async function(err, user) {
        if (!user){
            res.status(404).send("Data is not found");
            console.log(err);
        }
        else {
            if (!req.body.fullname ){ 
                res.status(400).send("user full name is require");
                return;
            }else if (!req.body.idRole != null){
               let role = Role.findById(req.body.idRole);
               if(!role){
                res.status(400).send("Role not found");
                return;
               }
            }else if (!req.body.idAccount != null){
                let account = Account.findById(req.body.idAccount)
                if (!account){
                    res.status(400).send("Account not found");
                    return;
                }
            }
            if(req.body.avatar != null){
                let image = await UploadImage.uploadFile(req.body.avatar);
                user.avatar = image.Location;
            }
            user.fullname = req.body.fullname;
            user.address = req.body.address;
            user.phoneNumber = req.body.phoneNumber;
            user.mail = req.body.mail;
            user.idAccount = req.body.idAccount;
            user.idRole = req.body.idRole;
            user.save().then(user => {
                res.status(200).json('Update complete');
            })
                .catch(err => {
                    res.status(400).send("unable to update the database");
                    console.log(err);
                });
        }
    });
}

const deleteById = function (req, res) {
    User.findByIdAndRemove({_id: req.params.id}, function(err, user){
        if(err){
            res.status(404).send("Data is not found");
            console.log(err);
        }
        else{
            res.status(200).json('Successfully removed');
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
