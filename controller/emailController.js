var nodemailer = require('nodemailer');
const express = require('express');

let user = {
    user: 'thienhoach14141@gmail.com',
    pass: 'bidaica1@'
}

let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: user.user,
       pass: user.pass
    }
});

const sendMailPayment = (book)=>{
  
    const message = {
        from: 'thienhoach14141@gmail.com', // Sender address
        to: book.mail,         // List of recipients
        subject: '[LC Health] Thanh toán thành công', // Subject line
        html: 'Bạn đã thanh toán đặt lịch khám thành công với số tiền: ' + book.idOrder.price+'<br>Xem thông tin lịch khám ở <a href="lchealth.surge.sh/history-book-details/'+book._id+'">đây</a> ' // Plain text body
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
    const message = {
        from: 'thienhoach14141@gmail.com', // Sender address
        to: book.mail,         // List of recipients
        subject: '[LC Health] Đặt khám thành công', // Subject line
        html: 'Bạn đã đặt lịch khám tại LC health thành công vào lúc: ' + book.time + ' ngày: '+ book.day+'<br>Xem thông tin lịch khám ở <a href="lchealth.surge.sh/history-book-details/'+book._id+'">đây</a> '
     
    };
    return transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
}

const senMailForgotPasswork = (otp,mail)=>{
    const message = {
        from: 'thienhoach14141@gmail.com', // Sender address
        to: mail,         // List of recipients
        subject: '[LC Health] Lấy lại mật khẩu', // Subject line
        text: 'Mã đặt lại mật khẩu của bạn là: ' + otp// Plain text body
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
    sendMailBooking,
    senMailForgotPasswork
};
