const express = require('express');
const User = require('./../database/table/user');
const Doctor = require('./../database/table/doctor');
const UploadImage = require('./upload');


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const create = async function(req, res) {
    if (!req.body.fullname) {
        res.status(400).send({ "message": "Không thể bỏ trống tên!" });
        return;
    } else if (!req.body.idRole != null) {
        let role = Role.findById(req.body.idRole);
        if (!role) {
            res.status(400).send({ "message": "Chức vụ không tồn tại" });
            return;
        }
    }
    const user = new User(req.body);
    // if(req.body.avatar != null){
    //     let image = await UploadImage.uploadFile(req.body.avatar);
    //     user.avatar = image.Location;
    // }
    user.save()
        .then(async user => {
            const doctor = new Doctor(req.body);
            doctor.idUser = user._id;
            // if(req.body.image != null){
            //     let image = await UploadImage.uploadFile(req.body.image);
            //     doctor.image = image.Location;
            // }
            doctor.save().then(doctor => {
                    res.status(200).json({ "message": "Tạo thành công" });
                })
                .catch(err => {
                    res.status(400).send({ "message": "Không thành công!" });
                    console.log(err);
                })
        })
        .catch(err => {
            res.status(400).send({ "message": "Không thành công" });
            console.log(err);
        });
}

const createByAdmin = (req, res) => {
    if (!req.body.fullname) {
        res.status(400).send({ "message": "Không thể bỏ trống tên!" });
        return;
    } else if (!req.body.idRole != null) {
        let role = Role.findById(req.body.idRole);
        if (!role) {
            res.status(400).send({ "message": "Role not found" });
            return;
        }
    }
    const tk = new Account(req.body);
    tk.save()
        .then(() => {
            const user = new User(req.body);
            user.save()
                .then(async user => {
                    const doctor = new Doctor(req.body);
                    doctor.idUser = user._id;
                    doctor.save()
                        .then(doctor => {
                            res.status(200).json({ "message": "Tạo thành công" });
                        })
                        .catch(err => {
                            res.status(400).send({ "message": "Không thành công!" });
                            console.log(err);
                        })
                })
                .catch(err => {
                    res.status(400).send({ "message": "Không thành công!" });
                    console.log(err);
                });
        })
        .catch(err => {
            res.status(400).send({ "message": "Không thể tạo tài khoản!" });
            console.log(err);
        });
}


const getOneById = function(req, res) {
    let id = req.params.id;
    Doctor.findById(id, async function(err, doctor) {
        if (!doctor) {
            res.status(404).send({ "message": "data is not found" });
            console.log(err);
        } else {
            var newjson = [];
            //const account = Account.find({}).populate('idRole');
            let faculty = '';
            await Doctor.findById(doctor._id, (err, doc) => {
                faculty = doc.idFaculty;
            }).populate('idFaculty');
            await User.findById(doctor.idUser, (err, user) => {
                newjson = [{
                    "_id": doctor._id,
                    "fullname": user.fullname,
                    "avatar": user.avatar,
                    "address": user.address,
                    "phoneNumber": user.phoneNumber,
                    "mail": user.mail,
                    "nickname": doctor.nickname,
                    "image": doctor.image,
                    "trainingPlaces": doctor.trainingPlaces,
                    "degree": doctor.degree,
                    "description": doctor.description,
                    "specialist": doctor.specialist,
                    "workingProcess": doctor.workingProcess,
                    "Faculty": faculty,
                    "Role": user.idRole.name,
                    "idAccount": user.idAccount,
                    "listDiagnostic": doctor.listDiagnostic
                }];
            }).populate('idAccount').populate('idRole');
            res.status(200).json(newjson);
        }
    });
}

const getAll = function(req, res) {
    Doctor.find(async function(err, doctors) {

        if (err) {
            res.status(400).send({ "message": "fail to get" });
            console.log(err);
        } else {
            var newjson = [];
            doctors.map(async function(doctor, err) {
                let faculty = '';
                await Doctor.findById(doctor._id, (err, doc) => {
                    faculty = doc.idFaculty;
                }).populate('idFaculty');
                await User.findById(doctor.idUser, (err, user) => {
                    json = {
                        "_id": doctor._id,
                        "fullname": user.fullname,
                        "avatar": user.avatar,
                        "address": user.address,
                        "phoneNumber": user.phoneNumber,
                        "mail": user.mail,
                        "nickname": doctor.nickname,
                        "image": doctor.image,
                        "trainingPlaces": doctor.trainingPlaces,
                        "degree": doctor.degree,
                        "description": doctor.description,
                        "specialist": doctor.specialist,
                        "workingProcess": doctor.workingProcess,
                        "Faculty": faculty,
                        "Role": user.idRole.name,
                        "idAccount": user.idAccount,
                        "listDiagnostic": doctor.listDiagnostic
                    };
                    newjson.push(json);
                }).populate('idAccount').populate('idRole');
            });
            await delay(3000);
            res.status(200).json(newjson);
            //return newjson;
        }
    });
}

const getByFaculty = function(req, res) {
    Doctor.find({ idFaculty: req.body.idFaculty }, (err, doctors) => {
        if (err) {
            res.status(400).send({ "message": "fail to get" });
            console.log(err);
            return;
        } else {
            res.status(200).json(doctors);
        }
    }).populate('idFaculty')
}


const updateById = function(req, res) {
    Doctor.findById(req.params.id, async function(err, doctor) {
        if (!doctor) {
            res.status(404).send({ "message": "Data is not found" });
            console.log(err);
        } else {
            User.findById(doctor.idUser, async function(err, user) {
                if (!req.body.fullname) {
                    res.status(400).send({ "message": "user full name is require" });
                    return;
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
                user.save().then(async user => {
                        // if(req.body.image != null){
                        //     let image2 = await UploadImage.uploadFile(req.body.image);
                        //     doctor.image = image2.Location;
                        // }
                        doctor.image = req.body.image;
                        doctor.nickname = req.body.nickname;
                        doctor.trainingPlaces = req.body.trainingPlaces;
                        doctor.degree = req.body.degree;
                        doctor.description = req.body.description;
                        doctor.specialist = req.body.specialist;
                        doctor.workingProcess = req.body.workingProcess;
                        doctor.listDiagnostic = req.body.listDiagnostic;
                        doctor.idFaculty = req.body.idFaculty;
                        doctor.save().then(doctor => {
                            res.status(200).json({ "message": "Update complete" });
                        }).catch(err => {
                            res.status(400).send({ "message": "unable to update the database" });
                            console.log(err);
                        });
                    })
                    .catch(err => {
                        res.status(400).send({ "message": "unable to update the database" });
                        console.log(err);
                    });
            });
        }
    });
}

const deleteById = function(req, res) {
    Doctor.findById({ _id: req.params.id }, function(err, doctor) {
        if (err) {
            res.status(404).send({ "message": "Data is not found" });
            console.log(err);
        } else {
            User.findById({ _id: doctor.idUser }, function(err, user) {
                if (err) {
                    res.status(404).send({ "message": "Data is not found" });
                    console.log(err);
                } else {
                    user.remove();
                    doctor.remove();
                    res.status(200).json({ "message": "Successfully removed" });
                }
            });
        }
    });
}

module.exports = {
    createByAdmin,
    create,
    getAll,
    getOneById,
    updateById,
    deleteById,
    getByFaculty
};