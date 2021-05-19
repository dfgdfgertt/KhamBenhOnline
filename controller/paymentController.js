const express = require('express');
const config = require('config');
const dateFormat = require('dateformat');
const querystring = require('qs');
const sha256 = require('sha256');
const Order = require('./../database/table/order');
const Booking = require('./../database/table/booking');
const SendMailPayment = require('./emailController');


const create_payment_url = async  function (req, res, next){
    var orderId = dateFormat(date, 'HHmmss');
    if (!req.body.idOrder) {
        res.status(400).send({"message": "Thiếu Id-Order."});
        return;
    }
    await Order.findById(req.body.idOrder, function(err, o){
        if (err) {
            res.status(400).send({"message": "Sai định dạng Id-Order."});
            return;
        } else {
            if (!o) {
                res.status(400).send({"message": "Hóa đơn không tồn tại."});
                return;
            }else{
                if (o.status) {
                    res.status(400).send({"message": "Hóa đơn này đã được thanh toán."});
                    return;
                }
                if (!o.idBooking.status) {
                    res.status(400).send({"message": "Lịch hẹn này đã bị hủy."});
                    return;
                }
                amount = o.price;
                o.idPayment = orderId;
                o.save()
                .catch(err =>{
                    res.status(400).send({"message": "Không thể tạo hóa đơn thanh toán."});
                    return;
                })
            }  
        }
    }).populate('idBooking');
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var tmnCode = config.get('vnp_TmnCode');
    var secretKey = config.get('vnp_HashSecret');
    var vnpUrl = config.get('vnp_Url');
    var returnUrl = config.get('vnp_ReturnUrl');

    var date = new Date();

    var createDate = dateFormat(date, 'yyyymmddHHmmss');
   
    var amount ;
    var bankCode = req.body.bankCode;
    
    var orderInfo = 'Thanh toan lich kham abc';
    var orderType = req.body.orderType;
    var locale = '';
    if(locale === null || locale === ''){
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

    var secureHash = sha256(signData);

    vnp_Params['vnp_SecureHashType'] =  'SHA256';
    vnp_Params['vnp_SecureHash'] = secureHash;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });

    //Neu muon dung Redirect thi dong dong ben duoi
    res.status(200).json({code: '00', data: vnpUrl})
    //Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren
    //res.redirect(vnpUrl)
}

const vnpay_ipn =  function (req, res, next){
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    var secretKey = config.get('vnp_HashSecret');
    var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });
    
    var checkSum = sha256(signData);

    if(secureHash === checkSum){
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        Order.findOneAndUpdate({idPayment: orderId},  {
            $set:{
                status: true
            }
        }).catch (e =>{
            console.log(e);
        }).then(o =>{
            Booking.findById(o.idBooking, function(err , book){
                if (book.mail) {
                    SendMailPayment.sendMailPayment(book)
                }
            }).populate('idOrder')
        })
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        //res.status(200).json({RspCode: '00', Message: 'success'})
        res.redirect('http://localhost:4000/home?thanhcongne')
    }
    else {
        //res.status(400).json({RspCode: '97', Message: 'Fail checksum'})
        res.redirect('http://localhost:4000/home?thatbaine')
    }
}

function sortObject(o) {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}


module.exports = {
  create_payment_url,
  vnpay_ipn
};