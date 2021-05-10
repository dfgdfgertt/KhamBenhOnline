const express = require('express');
const Role = require('./../database/table/role');
const Account = require('./../database/table/account');

const create = function (req, res) {
    if (!req.body.name){ 
        res.status(400).send({"message":"Role name is require."});
        return;
    }
    let role = new Role(req.body);
    role.save()
        .then(role => {
            res.status(200).json({"message": "create successfully."});
        })
        .catch(err => {
            res.status(400).send({"message":"unable to save to database."});
            console.log(err);
        });
}

const getAll = function (req, res) {
    Role.find(function(err, roles){
        if(err){
            res.status(400).send({"message":"fail to get."});
            console.log(err);
        }
        else {
            res.status(200).json(roles);
        }
    });
}

const getOneById = function (req, res) {
    let id = req.params.id;
    Role.findById(id, function (err, role){
        if (!role){
            res.status(400).send({"message":"data is not found."});
            console.log(err);
        }
        else {
            res.status(200).json(role);
        }
    });
}

const updateById = function (req, res) {
    Role.findById(req.params.id, function(err, role) {
        if (!role){
            res.status(400).send({"message":"Data is not found."});
            console.log(err);
        }
        else {
            if (!req.body.name){ 
                res.status(400).send({"message":"Role name is require."});
                return;
            }
            role.name = req.body.name;
            role.save().then(business => {
                res.status(200).json({"message":"Update complete."});
            })
                .catch(err => {
                    res.status(400).send({"message":"unable to update the database."});
                    console.log(err);
                });
        }
    });
}

const deleteById = function (req, res) {
    Role.findById({_id: req.params.id}, function(err, role){
        if(err){
            res.status(400).send({"message":"Sai định dạng Id-Role."});
            console.log(err);
            return;
        }
        else{
            if (!role) {
                res.status(400).send({"message":"Chức vụ không tồn tại không tồn tại."});
                console.log(err);
                return;
            } else {
                Account.findOne({idRole: role._id}, function (err, account) {
                    if (err) {
                        res.status(400).send({"message":"Sai định dạng Id-Role."});
                        console.log(err);
                        return;
                    } else {
                        if (account) {
                            console.log(account);
                            res.status(400).send({"message":"Không thể xóa khi tồn tại tài khoản thuộc chức vụ này."});
                            console.log(err);
                            return;
                        } else {
                            role.remove();
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
    deleteById
};
