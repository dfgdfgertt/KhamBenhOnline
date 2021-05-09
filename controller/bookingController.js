const express = require('express');
const Diagnostic = require('./../database/table/diagnostic');
const Symptom = require('./../database/table/symptom');
const Faculty = require('./../database/table/faculty');
const Booking = require('./../database/table/booking');
const Member = require('./../database/table/member');
const Order = require('./../database/table/order');

const create = async function(req, res) {
    if (req.body.idMember && req.body.idDiagnostic && req.body.idFaculty && req.body.idDoctor ) {
        res.status(400).send({ "message": "Điều kiện còn thiếu." });
        return;
    }
    const booking = new Booking(req.body);
    const order = new Order();
    order.idBooking = booking._id;
    await Faculty.findById(req.body.idFaculty, function (err, faculty) {
        if (err) {
            res.status(400).send({ "message": "Sai định dạng của Id-Khoa." });
            return;
        } else {
            if (!faculty) {
                res.status(400).send({ "message": "Khoa không tồn tại." });
            return;
            } else {
                order.price = faculty.price;
            }
        }
    })
    order.save().then(oder =>{
        booking.idOrder = oder._id
        booking.save().then(booking => {
            res.status(200).json({ "message": "Hẹn thành công." });
            return;
        }).catch( err =>{
            res.status(400).send({ "message": "Hẹn không thành công." });
            console.log(err);
            return;
        })
    }).catch( err =>{
        res.status(400).send({ "message": "Hẹn không thành công." });
        console.log(err);
        return;
    })
}

const getAll = function (req, res){
    Booking.find( function (err, bookings) {
        if (err) {
            res.status(400).send({ "message": "không thể lấy danh sách lịch hẹn." });
            console.log(err);
        } else {
            res.status(200).json(bookings);
        }
    })
    .populate('idDiagnostic')
    .populate('idDoctor')
    .populate('idFuculty')
    .populate('idMember')
    .populate('idOrder')
}

const getOneById = function (req, res){
    Booking.findById(req.params.id, function (err, booking) {
        if (err) {
            res.status(400).send({ "message": "sai định dạng Id-Booking." });
            console.log(err);
            return;
        } else {
            if (!booking) {
                res.status(400).send({ "message": "Lịch hẹn không tồn tại." });
                console.log(err);
                return;
            } else {
                res.status(200).json(booking);
                return;
            }
        }
    })
    .populate('idDiagnostic')
    .populate('idDoctor')
    .populate('idFuculty')
    .populate('idMember')
    .populate('idOrder')
}

const cancel = function (req, res) {
    Booking.findById(req.params.id, function (err, booking) {
        if (err) {
            res.status(400).send({ "message": "Sai định dạng Id-Booking." });
            console.log(err);
        } else {
            if (!booking) {
                res.status(400).send({ "message": "Lịch hẹn không tồn tại." });
                console.log(err);
                return;
            } else {
                booking.status = false;
                booking
                    .save()
                    .then(booking =>{
                        res.status(200).json({ "message": "Hủy lịch hẹn thành công." });
                        return;
                    })
                    .catch(err =>{
                        res.status(400).send({ "message": "Hủy lịch hẹn không thành công." });
                        console.log(err);
                        return;
                    })
            }
        }
    })
    .populate('idDiagnostic')
    .populate('idDoctor')
    .populate('idFuculty')
    .populate('idMember')
    .populate('idOrder')
}


const updateById = function (req, res) {
    Booking.findById(req.params.id, function (err, booking) {
        if (err) {
            res.status(400).send({ "message": "Sai định dạng Id-Booking." });
            console.log(err);
        } else {
            if (!booking) {
                res.status(400).send({ "message": "Lịch hẹn không tồn tại." });
                console.log(err);
                return;
            } else {
                booking.customer = req.body.customer;
                booking.phoneNumber = req.body.phoneNumber;
                booking.mail = req.body.phoneNumber;
                booking
                    .save()
                    .then(booking =>{
                        res.status(200).json({ "message": "Hủy lịch hẹn thành công." });
                        return;
                    })
                    .catch(err =>{
                        res.status(400).send({ "message": "Hủy lịch hẹn không thành công." });
                        console.log(err);
                        return;
                    })
            }
        }
    })
    .populate('idDiagnostic')
    .populate('idDoctor')
    .populate('idFuculty')
    .populate('idMember')
    .populate('idOrder')
}

const deleteById = function (req, res) {
    Booking.findById(req.params.id, function (err, booking) {
        if (err) {
            res.status(400).send({ "message": "Sai định dạng Id-Booking." });
            console.log(err);
        } else {
            if (!booking) {
                res.status(400).send({ "message": "Lịch hẹn không tồn tại." });
                console.log(err);
                return;
            } else {
                Order.findById(booking.idOrder, function(err, order){
                    if (err) {
                        res.status(400).send({ "message": "Sai định dạng Id-Order." });
                        console.log(err);
                    } else {
                        if (!order) {
                            res.status(400).send({ "message": "Hoá đơn không tồn tại." });
                            console.log(err);
                            return;
                        } else {
                            order.remove();
                        }
                    }
                })
                booking.remove();
                res.status(200).json({ "message": "Xóa lịch hẹn thành công." });
                return;
            }
        }
    })
}


module.exports = {
    create,
    getAll,
    getOneById,
    cancel,
    updateById,
    deleteById
};
