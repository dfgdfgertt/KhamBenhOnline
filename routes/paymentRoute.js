const express = require('express');
const router = express.Router();
const controller = require('./../controller/paymentController');

//link: http://localhost:9000/api/payment/

// Defined store route
router.route('/create').post(controller.create_payment_url);
router.route('/get').get(controller.vnpay_ipn);

module.exports = router;