var nodemailer = require('nodemailer');
const express = require('express');

const user = {
    user: 'thienhoach14141@gmail.com',
    pass: 'bidaica1@'
}

const sendMailPayment = (book)=>{
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
           user: user.user,
           pass: user.pass
        }
    });
    const message = {
        from: 'thienhoach14141@gmail.com', // Sender address
        to: book.mail,         // List of recipients
        subject: 'Thanh toán thành công', // Subject line
        text: 'Bạn đã thanh toán đặt lịch khám thành công với số tiền: ' + book.idOrder.price // Plain text body
    };
    return transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
}


const sendMailBooking = (book)=>{
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
           user: user.user,
           pass: user.pass
        }
    });
    const message = {
        from: 'thienhoach14141@gmail.com', // Sender address
        to: book.mail,         // List of recipients
        subject: 'Đặt khám thành công', // Subject line
        text: 'Bạn đã đặt lịch khám thành công <br> vào lúc: ' + book.time + ' ngày: '+ book.day// Plain text body
    };
    return transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
}

module.exports = {
    sendMailPayment,
    sendMailBooking
};
