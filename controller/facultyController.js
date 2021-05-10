const express = require('express');
const Khoa = require('./../database/table/faculty');
const Doctor = require('./../database/table/doctor');
const Diagnostic = require('./../database/table/diagnostic');
const Booking = require('./../database/table/booking');

const create = async function (req, res) {
    if (!req.body.name){ 
        res.status(400).send({"message":"Faculty name is require"});
        return;
    }
    let khoa = new Khoa(req.body);
    // if(req.body.logo != null){
    //     let image = await UploadImage.uploadFile(req.body.logo);
    //     khoa.logo = image.Location;
    // }
    //khoa.name = req.body.name;
    //khoa.description = req.body.description;
    await khoa.save()
        .then(khoa => {
            res.status(200).json({"message": "faculty create successfully"});
        })
        .catch(err => {
            res.status(400).send({"message":"unable to save to database"});
            console.log(err)
        });
}

const get = function (req, res){
    Khoa.find(function(err, khoas){
        if(err){
            res.status(400).send({"message":"data is not found"});
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
            res.status(400).send({"message":"data is not found"});
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
            res.status(400).send({"message":"data is not found"});
            console.log(err);
        }
        else {
            if (!req.body.name){ 
                res.status(400).send({"message":"unable to save to database"});
                return;
            }
            // if(req.body.logo != null){
            //     let image = await UploadImage.uploadFile(req.body.logo);
            //     khoa.logo = image.Location;
            //     //khoa.logo = updateOne(req.body.logo);
            // }
            khoa.logo = req.body.logo;
            khoa.name = req.body.name;
            khoa.description = req.body.description;
            khoa.save().then(business => {
                res.status(200).json({"message":"Update complete"});
            })
                .catch(err => {
                    res.status(400).send({"message":"unable to update the database"});
                    console.log(err);
                });
        }
    });
}

const deleteById = function (req, res) {
    Khoa.findById({_id: req.params.id}, function(err, faculty){
        if(err){
            res.status(400).json({"message":"Sai định dạng Id-Faculty."});
            console.log(err);
            return;
        } 
        else {
            if (!faculty) {
                res.status(400).json({"message":"Khoa không tồn tại."});
                console.log(err);
                return;
            } else {
                Doctor.findOne({idFaculty: faculty._id},function (err, doc) {
                    if (err) {
                        res.status(400).json({"message":"Sai định dạng Id-Faculty."});
                        console.log(err);
                        return;
                    } else {
                        if (doc) {
                            res.status(400).json({"message":"Không thể xóa khi tồn tại bác sĩ thuộc " + faculty.name});
                            console.log(err);
                            return;
                        } else{
                            Booking.findOne({idFaculty: faculty._id},function (err, booking) {
                                if (err) {
                                    res.status(400).json({"message":"Sai định dạng Id-Faculty."});
                                    console.log(err);
                                    return;
                                } else {
                                    if (booking) {
                                        res.status(400).json({"message":"Không thể xóa khi tồn tại lịch hẹn thuộc " + faculty.name});
                                        console.log(err);
                                        return;
                                    } else{
                                        Diagnostic.findOne({idFaculty: faculty._id},function (err, diagnostic) {
                                            if (err) {
                                                res.status(400).json({"message":"Sai định dạng Id-Faculty."});
                                                console.log(err);
                                                return;
                                            } else {
                                                if (diagnostic) {
                                                    res.status(400).json({"message":"Không thể xóa khi tồn tại chuẩn đoán thuộc " + faculty.name});
                                                    console.log(err);
                                                    return;
                                                } else{
                                                    //faculty.remove();
                                                    res.status(200).json({"message":"Xóa thành công"});
                                                    return;
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    });
}

module.exports = {
    create,
    get,
    getOnebyId,
    updateById,
    deleteById
};
