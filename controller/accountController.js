const express = require('express');
const user = require('../database/table/user');
const Account = require('./../database/table/account');
const Role = require('./../database/table/role');

const create = async function (req, res) {
    if (!req.body.username){ 
        res.status(400).send("Username is require");
        return;
    }else if (!req.body.password){
        res.status(400).send("Password is require");
        return;
    }
    await Account.findOne({username: req.body.username}, async function(err, account) {
        if (err) {
              console.loh(err);
        }
        else{
            if (account){
                res.status(400).send("Username already exists");
                return;
            }
        }
        }
    );
    let account = new Account(req.body);
    account.save()
        .then(account => {
            res.status(200).json({'role': 'create successfully'});
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
            console.log(err);
        });
}

const getAll = function (req, res) {
    Account.find(function(err, accounts){
        if(err){
            res.status(400).send("fail to get");
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
            res.status(404).send("data is not found");
            console.log(err);
        }
        else {
            res.status(200).json(account);
        }
    }).populate('idRole');
}

const updateById = function (req, res) {
    Account.findById(req.params.id, function(err, account) {
        if (!account){
            res.status(404).send("Data is not found");
            console.log(err);
        }
        else {
            if (!req.body.userName ){ 
                res.status(400).send("User name is require");
                return;
            }else if (!req.body.password){
                res.status(400).send("Password is require");
                return;
            }
            let role = Role.findById(req.body.idRole);
            if (!role){
                res.status(400).send("Role not found");
                return;
            }
            account.username = req.body.username;
            account.password = req.body.password;
            account.idRole = req.body.idRole;
            account.save().then(business => {
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
    Account.findByIdAndRemove({_id: req.params.id}, function(err, account){
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
