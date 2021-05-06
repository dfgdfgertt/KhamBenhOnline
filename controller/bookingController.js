const express = require('express');
const Diagnostic = require('./../database/table/diagnostic');
const Symptom = require('./../database/table/symptom');
const Faculty = require('./../database/table/faculty');
const Booking = require('./../database/table/booking');
const Member = require('./../database/table/member');
const Order = require('./../database/table/order');

const create = function(req, res) {
    if (!req.body.idMember || !req.body.idDiagnostic || !req.body.idFuculty || !req.body.idDoctor ) {
        res.status(400).send({ "message": "Điều kiện còn thiếu" });
        return;
    }
    const booking = new Booking(req.body);
    const order = new Order();
    order.idBooking = booking._id;
    order.save().then(oder =>{
        booking.save().then(booking => {
            res.status(200).json({ "message": "Hẹn thành công" });
            return;
        }).catch( err =>{
            res.status(400).send({ "message": "Hẹn không thành công" });
            console.log(err);
            return;
        })
    }).catch( err =>{
        res.status(400).send({ "message": "Hẹn không thành công" });
        console.log(err);
        return;
    })
}