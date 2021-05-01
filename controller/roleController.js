const express = require('express');
const Role = require('./../database/table/role');

const create = function (req, res) {
    if (!req.body.name){ 
        res.status(400).send("Role name is require");
        return;
    }
    let role = new Role(req.body);
    role.save()
        .then(role => {
            res.status(200).json({'role': 'create successfully'});
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
            console.log(err);
        });
}

const getAll = function (req, res) {
    Role.find(function(err, roles){
        if(err){
            res.status(400).send("fail to get");
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
            res.status(404).send("data is not found");
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
            res.status(404).send("Data is not found");
            console.log(err);
        }
        else {
            if (!req.body.name){ 
                res.status(400).send("Role name is require");
                return;
            }
            role.name = req.body.name;
            role.save().then(business => {
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
    Role.findByIdAndRemove({_id: req.params.id}, function(err, person){
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