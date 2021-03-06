const express = require('express');
const Faculty = require('./../database/table/faculty');
const Booking = require('./../database/table/booking');
const Order = require('./../database/table/order');
const Member = require('./../database/table/member');
const SendMailBooking = require('./emailController');

const create = function(req, res) {
    console.log(req.body);
    if (req.body.idMember && req.body.idDiagnostic && req.body.idFaculty && req.body.idDoctor ) {
        res.status(400).send({ "message": "Điều kiện còn thiếu." });
        return;
    }
    if (!req.body.customer) {
        res.status(400).send({ "message": "Xin vui lòng điền tên người khám." });
        return;
    }
    if (!req.body.day) {
        res.status(400).send({ "message": "Xin vui lòng chọn ngày đặt khám." });
        return;
    }
    if (!req.body.time) {
        res.status(400).send({ "message": "Xin vui lòng chọn thời gian đặt khám." });
        return;
    }
    if (!req.body.mail) {
        res.status(400).send({ "message": "Xin vui lòng nhập địa chỉ Email." });
        return;
    }
    let booking = new Booking(req.body);
    let order = new Order();
    Booking.find({$and:[{day: req.body.day ,idFaculty: req.body.idFaculty ,status: true}]}, function (err, bookings) {
        if (err) {
            res.status(400).send({ "message": "Sai định dạng ngày." });
            console.log(err)
            return;
        } else {
            if (bookings.length >= 24) {
                res.status(400).send({ "message": "Hôm nay đã đầy lịch khám. Xin vui lòng đặt khám vào các ngày tiếp theo." });
                console.log(err)
                return;
            } 
            else {
                Booking.find({$and:[{day: req.body.day ,idFaculty: req.body.idFaculty, time: req.body.time ,status: true}]}, function (err, bookingss) {
                    if (err) {
                        res.status(400).send({ "message": "Sai định dạng thời gian." });
                        console.log(err)
                        return;
                    } else {

                        if (bookingss.length >= 3) {
                            res.status(400).send({ "message": "Thời gian này đã đầy lịch khám. Xin vui lòng đặt khám vào các giờ khác." });
                            console.log(err)
                            return;
                        } 
                        else{
                            Faculty.findById(req.body.idFaculty, function (err, faculty) {
                                if (err) {
                                    res.status(400).send({ "message": "Sai định dạng của Id-Khoa." });
                                    return;
                                } else {
                                    if (!faculty) {
                                        res.status(400).send({ "message": "Khoa không tồn tại." });
                                    return;
                                    } else {
                                        order.idBooking = booking._id;
                                        if ((order.price == 0)||(order.price =='') ){
                                            order.status = true;
                                        }
                                        order.price = faculty.price;
                                        order.save()
                                        .then(oder =>{
                                            booking.idOrder = oder._id
                                            booking.save().then(booking => {
                                                Booking.findById(booking._id , function (err, book) {
                                                    if (err) {
                                                        res.status(400).send({ "message": "loi ne" });
                                                        console.log(err);
                                                        return;
                                                    } else {
                                                        if (!book) {
                                                            res.status(400).send({ "message": "khong tim ra" });
                                                            console.log(err);
                                                            return;
                                                        } else {
                                                            SendMailBooking.sendMailBooking(book);
                                                            res.status(200).json(book);
                                                            return;
                                                        }
                                                    }
                                                    }).populate('idOrder');
                                            }).catch( err =>{
                                                res.status(400).send({ "message": "Đặt khám không thành công." });
                                                console.log(err);
                                                return;
                                            })
                                        }).catch( err =>{
                                            res.status(400).send({ "message": "Đặt khám không thành công." });
                                            console.log(err);
                                            return;
                                        })
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

const getAll = function (req, res){
    Booking.find( function (err, bookings) {
        if (err) {
            res.status(400).send({ "message": "không thể lấy danh sách lịch đặt khám." });
            console.log(err);
        } else {
            res.status(200).json(bookings);
        }
    })
    .populate('idFaculty')
    .populate('idOrder')
    .populate({ path: 'idMember',   populate:{ path:'idUser' }})
    .populate({ path: 'idDoctor',   populate:{ path:'idUser' }})
    .sort({day: -1, time: 1})
}

const getBookingByIdMember = function (req, res) {
    Booking.find( {idMember: req.params.id},function (err, bookings) {
        if (err) {
            res.status(400).send({ "message": "không thể lấy danh sách lịch đặt khám." });
            console.log(err);
            return
        } else {
            res.status(200).send(bookings);
            return
        }
    })
    .populate('idFaculty')
    .populate('idOrder')
    .populate({ path: 'idMember',   populate:{ path:'idUser' }})
    .populate({ path: 'idDoctor',   populate:{ path:'idUser' }})
    .sort({day: -1, time: 1})
}

const getBookingByIdFaculty = function (req, res) {
    Booking.find( {idFaculty: req.params.id},function (err, bookings) {
        if (err) {
            res.status(400).send({ "message": "không thể lấy danh sách lịch đặt khám." });
            console.log(err);
        } else {
            res.status(200).json(bookings);
        }
    })
    .populate('idFaculty')
    .populate('idOrder')
    .populate({ path: 'idMember',   populate:{ path:'idUser' }})
    .populate({ path: 'idDoctor',   populate:{ path:'idUser' }})
    .sort({day: -1, time: 1})
}

const getBookingByIdDoctor = function (req, res) {
    Booking.find( {idDoctor: req.params.id},function (err, bookings) {
        if (err) {
            res.status(400).send({ "message": "không thể lấy danh sách lịch đặt khám." });
            console.log(err);
        } else {
            res.status(200).json(bookings);
        }
    })
    .populate('idFaculty')
    .populate('idOrder')
    .populate({ path: 'idMember',   populate:{ path:'idUser' }})
    .populate({ path: 'idDoctor',   populate:{ path:'idUser' }})
    .sort({day: -1, time: 1})
}

const getOneById = function (req, res){
    Booking.findById(req.params.id, function (err, booking) {
        if (err) {
            res.status(400).send({ "message": "sai định dạng Id-Booking." });
            console.log(err);
            return;
        } else {
            if (!booking) {
                res.status(400).send({ "message": "Lịch khám không tồn tại." });
                console.log(err);
                return;
            } else {
                res.status(200).json(booking);
                return;
            }
        }
    })
    .populate('idFaculty')
    .populate('idOrder')
    .populate({ path: 'idMember',   populate:{ path:'idUser' }})
    .populate({ path: 'idDoctor',   populate:{ path:'idUser' }})
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
                            if (order.status) {
                                return res.status(400).send({ "message": "Không thể hủy khi lịch hẹn đã được thanh toán." });
                            }
                            else if (!booking.status) {
                                return res.status(400).send({ "message": "Lịch hẹn đã bị hủy trước đó." });
                            } else {
                                booking.status = false;
                                booking
                                    .save()
                                    .then(booking =>{
                                        res.status(200).json({ "message": "Hủy hẹn khám thành công." });
                                        return;
                                    })
                                    .catch(err =>{
                                        res.status(400).send({ "message": "Hủy hẹn khám không thành công." });
                                        console.log(err);
                                        return;
                                    })
                            }
                        }
                    }
                })
            }
        }
    })
}


const updateById = function (req, res) {
    Booking.findById(req.params.id, function (err, booking) {
        if (err) {
            res.status(400).send({ "message": "Sai định dạng Id-Booking." });
            console.log(err);
        } else {
            if (!booking) {
                res.status(400).send({ "message": "Lịch khám không tồn tại." });
                console.log(err);
                return;
            } else {
                booking.customer = req.body.customer;
                booking.phoneNumber = req.body.phoneNumber;
                booking.mail = req.body.phoneNumber;
                booking
                    .save()
                    .then(booking =>{
                        res.status(200).json({ "message": "Thay đổi lịch khám thành công." });
                        return;
                    })
                    .catch(err =>{
                        res.status(400).send({ "message": "Thay đổi lịch khám không thành công." });
                        console.log(err);
                        return;
                    })
            }
        }
    })
    .populate('idDiagnostic')
    .populate('idFaculty')
    .populate('idOrder')
    .populate({ path: 'idMember',   populate:{ path:'idUser' }})
    .populate({ path: 'idDoctor',   populate:{ path:'idUser' }})
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
                            if (order.status) {
                                return res.status(400).send({ "message": "Không thể xóa khi lịch hẹn đã được thanh toán." });
                            }
                            else if (booking.status) {
                                return res.status(400).send({ "message": "Không thể xóa khi lịch hẹn chưa bị hủy." });
                            } else {
                                order.remove().then(o =>{
                                    booking.remove().then(b =>{
                                        res.status(200).json({ "message": "Xóa lịch hẹn thành công." });
                                        return;
                                    });
                                });
                            }
                        }
                    }
                })
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
    deleteById,
    getBookingByIdMember,
    getBookingByIdFaculty,
    getBookingByIdDoctor
};
