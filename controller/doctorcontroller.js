const express = require('express');
const User = require('./../database/table/user');
const Doctor = require('./../database/table/doctor');
const Role = require('./../database/table/role');
const Account = require('./../database/table/account');

const create = async function(req, res) {
    if (!req.body.fullname) {
        res.status(400).send({ "message": "Không thể bỏ trống tên!" });
        return;
    }else if (!req.body.password){
        res.status(400).send({"message":"Password is require"});
        return;
    }
    const user = new User(req.body);
    user.save()
        .then(async user => {
            const doctor = new Doctor(req.body);
            doctor.idUser = user._id;
            doctor.save().then(doctor => {
                    res.status(200).json({ "message": "Tạo thành công" });
                    return;
                })
                .catch(err => {
                    user.remove();
                    res.status(400).send({ "message": "Không thành công!" });
                    console.log(err);
                    return;
                })
        })
        .catch(err => {
            res.status(400).send({ "message": "Không thành công" });
            console.log(err);
        });
}

const createByAdmin = async (req, res) => {
    if (!req.body.fullname) {
        res.status(400).send({ "message": "Không thể bỏ trống tên!" });
        return;
    }else if (!req.body.password){
        res.status(400).send({"message":"Password is require"});
        return;
    }
    await Account.findOne({username: req.body.username},function(err, account) {
        if (err) {
              console.loh(err);
        }
        else{
            if (account){
                res.status(400).send({"message":"Username already exists"});
                return;
            }
        }
    })
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
                            user.remove();
                            tk.remove();
                        })
                })
                .catch(err => {
                    res.status(400).send({ "message": "Không thành công!" });
                    console.log(err);
                    tk.remove();
                });
        })
        .catch(err => {
            res.status(400).send({ "message": "Không thể tạo tài khoản!" });
            console.log(err);
        });
}

const updateByIdByAdmin = function(req, res){
    //console.log(req.body);
    Doctor.findById(req.params.id, async function(err, doctor) {
        if (!doctor) {
            res.status(404).send({ "message": "Data is not found" });
            console.log(err);
        } else {
            User.findById(doctor.idUser, async function(err, user) {
                user.avatar = req.body.avatar;
                user.fullname = req.body.fullname;
                user.address = req.body.address;
                user.phoneNumber = req.body.phoneNumber;
                user.mail = req.body.mail;
                //user.idRole = req.body.idRole;
                Account.findOne({username: req.body.username}, (err , acc)=>{
                    if (err) {
                        res.status(404).send({ "message": "Data is not found" });
                        console.log(err);
                        return;
                    } else {
                        if (acc && acc._id != user.idAccount) {
                            res.status(404).send({ "message": "Tài khoản đã tồn tại" });
                            console.log(err);
                            return;
                        }else{
                            Account. findById(user.idAccount, (err , acc)=>{
                                if (err) {
                                    res.status(404).send({ "message": "Data is not found" });
                                    console.log(err);
                                } else {
                                    acc.username = req.body.username;
                                    acc.password = req.body.password;
                                    acc.save().then(async acc =>{
                                        user.save().then(async user => {
                                            doctor.nickname = req.body.nickname;
                                            doctor.trainingPlaces = req.body.trainingPlaces;
                                            doctor.degree = req.body.degree;
                                            doctor.description = req.body.description;
                                            doctor.listDiagnostic = req.body.listDiagnostic;
                                            doctor.idFaculty = req.body.idFaculty;
                                            doctor.save().then(doctor => {
                                                res.status(200).json({ "message": "Update complete" });
                                            }).catch(err => {
                                                res.status(400).send({ "message": "unable to update the database" });
                                                console.log(err);
                                            });
                                        })
                                    }).catch(err => {
                                        res.status(400).send({ "message": "unable to update the database" });
                                        console.log(err);
                                    });
                                }
                            })
                        }
                    }
                })
            });
        }
    });
}


const getOneById = function(req, res) {
    let id = req.params.id;
    Doctor.findById(id, async function(err, doctor) {
        if (!doctor) {
            res.status(404).send({ "message": "data is not found" });
            console.log(err);
        } else {
            // var newjson = [];
            // await User.findById(doctor.idUser, (err, user) => {
            //     newjson = [{
            //         "_id": doctor._id,
            //         "fullname": user.fullname,
            //         "avatar": user.avatar,
            //         "address": user.address,
            //         "phoneNumber": user.phoneNumber,
            //         "mail": user.mail,
            //         "nickname": doctor.nickname,
            //         "trainingPlaces": doctor.trainingPlaces,
            //         "degree": doctor.degree,
            //         "description": doctor.description,
            //         "Faculty": doctor.idFaculty,
            //         "Role": user.idRole.name,
            //         "idAccount": user.idAccount,
            //         "listDiagnostic": doctor.listDiagnostic
            //     }];
            // }).populate('idAccount').populate('idRole');
            // await delay(500);
            res.status(200).json(doctor);
        }
    }).populate('idFaculty').populate({ path: 'idUser',  populate:{ path:'idAccount' , populate: { path: 'idRole'}}});
}

const getAll = function(req, res) {
    Doctor.find(async function(err, doctors) {
        if (err) {
            res.status(400).send({ "message": "fail to get" });
            console.log(err);
        } else {
            // var newjson = [];
            // doctors.map(async function(doctor, err) {
            //     await User.findById(doctor.idUser, (err, user) => {
            //         json = {
            //             "_id": doctor._id,
            //             "fullname": user.fullname,
            //             "avatar": user.avatar,
            //             "address": user.address,
            //             "phoneNumber": user.phoneNumber,
            //             "mail": user.mail,
            //             "nickname": doctor.nickname,
            //             "trainingPlaces": doctor.trainingPlaces,
            //             "degree": doctor.degree,
            //             "description": doctor.description,
            //             "Faculty": doctor.idFaculty,
            //             "Role": user.idRole.name,
            //             "idAccount": user.idAccount,
            //             "listDiagnostic": doctor.listDiagnostic
            //         };
            //         newjson.push(json);
            //     }).populate('idAccount').populate('idRole');
            // });
            //await delay(5000);
            res.status(200).json(doctors);
            //return newjson;
        }
    }).populate('idFaculty').populate({ path: 'idUser',  populate:{ path:'idAccount' , populate: { path: 'idRole'}}});
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
                user.avatar = req.body.avatar;
                user.fullname = req.body.fullname;
                user.address = req.body.address;
                user.phoneNumber = req.body.phoneNumber;
                user.mail = req.body.mail;
                user.idRole = req.body.idRole;
                user.save().then(async user => {
                        doctor.nickname = req.body.nickname;
                        doctor.trainingPlaces = req.body.trainingPlaces;
                        doctor.degree = req.body.degree;
                        doctor.description = req.body.description;
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
    getByFaculty,
    updateByIdByAdmin
};