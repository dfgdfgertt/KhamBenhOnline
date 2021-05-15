var nodemailer = require('nodemailer');
const express = require('express');

const sendMailPayment = (book)=>{
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
           user: 'thienhoach14141@gmail.com',
           pass: 'bidaica1'
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

module.exports = {
    sendMailPayment
};
