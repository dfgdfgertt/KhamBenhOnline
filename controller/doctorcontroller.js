const express = require('express');
const User = require('./../database/table/user');
const Doctor = require('./../database/table/doctor');
const Role = require('./../database/table/role');
const Account = require('./../database/table/account');
const account = require('./../database/table/account');


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const create = async function(req, res) {
    if (!req.body.fullname) {
        res.status(400).send({ "message": "Không thể bỏ trống tên!" });
        return;
    }
    if (!req.body.idRole != null) {
        Role.findById(req.body.idRole, (err, role)=>{
            if (err) {
                res.status(400).send({ "message": "Chức vụ không tồn tại" });
                console.log(err);
                return;
            }
        })
    }
    const user = new User(req.body);
    user.save()
        .then(async user => {
            const doctor = new Doctor(req.body);
            doctor.idUser = user._id;
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
            user.idAccount = tk._id;
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
            await User.findById(doctor.idUser, (err, user) => {
                newjson = [{
                    "_id": doctor._id,
                    "fullname": user.fullname,
                    "avatar": user.avatar,
                    "address": user.address,
                    "phoneNumber": user.phoneNumber,
                    "mail": user.mail,
                    "nickname": doctor.nickname,
                    "trainingPlaces": doctor.trainingPlaces,
                    "degree": doctor.degree,
                    "description": doctor.description,
                    "Faculty": doctor.idFaculty,
                    "Role": user.idRole.name,
                    "idAccount": user.idAccount,
                    "listDiagnostic": doctor.listDiagnostic
                }];
            }).populate('idAccount').populate('idRole');
            await delay(500);
            res.status(200).json(newjson);
        }
    }).populate('idFaculty');
}

const getAll = function(req, res) {
    Doctor.find(async function(err, doctors) {
        if (err) {
            res.status(400).send({ "message": "fail to get" });
            console.log(err);
        } else {
            var newjson = [];
            doctors.map(async function(doctor, err) {
                await User.findById(doctor.idUser, (err, user) => {
                    json = {
                        "_id": doctor._id,
                        "fullname": user.fullname,
                        "avatar": user.avatar,
                        "address": user.address,
                        "phoneNumber": user.phoneNumber,
                        "mail": user.mail,
                        "nickname": doctor.nickname,
                        "trainingPlaces": doctor.trainingPlaces,
                        "degree": doctor.degree,
                        "description": doctor.description,
                        "Faculty": doctor.idFaculty,
                        "Role": user.idRole.name,
                        "idAccount": user.idAccount,
                        "listDiagnostic": doctor.listDiagnostic
                    };
                    newjson.push(json);
                }).populate('idAccount').populate('idRole');
            });
            await delay(2000);
            res.status(200).json(newjson);
            //return newjson;
        }
    }).populate('idFaculty');
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
            res.status(404).send({ "message": "Bác sĩ không tồn tại" });
            console.log(err);
            return;
        } else {
            User.findById({ _id: doctor.idUser }, function(err, user) {
                if (err) {
                    res.status(404).send({ "message": "Lỗi không tìm thấy thông tin" });
                    console.log(err);
                    return;
                } else {
                    Account.findById({ _id: user.idAccount }, function(err, account){
                        if (err) {
                            res.status(404).send({ "message": "Lỗi không tìm thấy thông tin" });
                            console.log(err);
                            return;
                        } else {
                            account.remove();
                            user.remove();
                            doctor.remove();
                            res.status(200).json({ "message": "Xóa thành công" });
                            return;
                        }
                    })
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