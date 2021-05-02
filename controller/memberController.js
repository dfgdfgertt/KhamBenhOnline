const express = require('express');
const User = require('./../database/table/user');
const Member = require('./../database/table/member');
const UploadImage = require('./upload');


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

const create = async function (req, res) {
    if (!req.body.fullname ){ 
        res.status(400).send({"message":"Full name is require"});
        return;
    }
    let user = new User(req.body);
    if(req.body.avatar != null){
        let image = await UploadImage.uploadFile(req.body.avatar);
        user.avatar = image.Location;
    }
    user.save()
        .then(user => {
            const member = new Member();
            member.idUser = user._id;
            member.save().then(member =>{
                res.status(200).json({"message":"Create successfully"});
            })
            .catch(err => {
                res.status(400).send({"message":"unable to save to database"});
                console.log(err);
            })
        })
        .catch(err => {
            res.status(400).send({"message":"unable to save to database"});
            console.log(err);
        });
}


const getOneById = function (req, res) {
    let id = req.params.id;
    Member.findById(id, async function (err, member){
        if (!member){
            res.status(404).send({"message":"data is not found"});
            console.log(err);
        }
        else {
            var newjson = [];
            //const account = Account.find({}).populate('idRole');
            await User.findById(member.idUser , (err, user)=>{
                newjson = [
                    {
                        "_id": member._id,
                        "fullname": user.fullname,
                        "avatar": user.avatar,
                        "address": user.address,
                        "phoneNumber": user.phoneNumber,
                        "mail": user.mail,
                        "Role": user.idRole.name,
                        "idAccount": user.idAccount
                    }
                ];
            }).populate('idAccount').populate('idRole');
            res.status(200).json(newjson);
        }
    });
}

const getAll = function (req, res) {
    Member.find( async function(err, members){
        
        if(err){
            res.status(400).send({"message":"fail to get"});
            console.log(err);
        }
        else { 
            var newjson = [];
            members.map(async function (member, err) {
                await User.findById(member.idUser, (err, user) => {
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
                    newjson.push(json);
                }).populate('idAccount').populate('idRole');
            })
            await delay(3000);
            res.status(200).json(newjson);
            //return newjson;
        }
    });
}


const updateById = function (req, res) {
    Member.findById(req.params.id,async function(err, member) {
        if (!member){
            res.status(404).send({"message":"Data is not found"});
            console.log(err);
        }
        else {
            User.findById(member.idUser , async function(err, user) {
                if (!req.body.fullname ){ 
                    res.status(400).send({"message":"user full name is require"});
                    return;
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
                        res.status(400).send({"message":"unable to update the database"});
                        console.log(err);
                    });
            });
        }
    });
}

const deleteById = function (req, res) {
    Member.findById({_id: req.params.id}, function(err, member){
        if(err){
            res.status(404).send({"message":"Data is not found"});
            console.log(err);
        }
        else{
            User.findById({_id: member.idUser}, function(err, user){
                if(err){
                    res.status(404).send({"message":"Data is not found"});
                    console.log(err);
                }
                else{
                    user.remove();
                }});
            member.remove();
            res.status(200).json({"message":"Successfully removed"});
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
