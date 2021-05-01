const express = require('express');
const Khoa = require('./../database/table/faculty');
const UploadImage = require('./upload');

const create = async function (req, res) {
    let khoa = new Khoa();
    if (!req.body.name){ 
        res.status(400).send("Faculty name is require");
        return;
    }
    if(req.body.logo != null){
        let image = await UploadImage.uploadFile(req.body.logo);
        khoa.logo = image.Location;
    }
    khoa.name = req.body.name;
    khoa.description = req.body.description;
    await khoa.save()
        .then(khoa => {
            res.status(200).json({'faculty': 'faculty in create successfully'});
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
            console.log(err)
        });
}

const get = function (req, res){
    Khoa.find(function(err, khoas){
        if(err){
            res.status(404).send("data is not found");
            console.log(err);
        }
        else {
            res.status(200).json(khoas);
        }
    });
}

const getOnebyId = function (req, res) {
    let id = req.params.id;
    Khoa.findById(id, function (err, khoa){
        if (!khoa){
            res.status(404).send("data is not found");
            console.log(err);
        }
        else {
            res.status(200).json(khoa);
        }
    });
}



const updateById = function (req, res) {
    Khoa.findById(req.params.id, async function(err, khoa) {
        if (!khoa){
            res.status(404).send("data is not found");
            console.log(err);
        }
        else {
            if (!req.body.name){ 
                res.status(400).send("unable to save to database");
                return;
            }
            if(req.body.logo != null){
                let image = await UploadImage.uploadFile(req.body.logo);
                khoa.logo = image.Location;
                //khoa.logo = updateOne(req.body.logo);
            }
            khoa.name = req.body.name;
            khoa.description = req.body.description;
            khoa.save().then(business => {
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
    Khoa.findByIdAndRemove({_id: req.params.id}, function(err, person){
        if(err){
            res.status(400).json("Data is not found");
            console.log(err);
        } 
        else res.status(200).json('Successfully removed');
    });
}

module.exports = {
    create,
    get,
    getOnebyId,
    updateById,
    deleteById
};
