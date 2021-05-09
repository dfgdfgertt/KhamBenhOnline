const express = require('express');
const router = express.Router();
const controller = require('./../controller/bookingController');

//link: http://113.173.154.51:9000/api/booking/
//link: http://localhost:9000/api/booking/

// Defined store route
router.route('/create').post(controller.create);

 // Defined get data(index or listing) route
 router.route('/get').get(controller.getAll);

// Defined get route
router.route('/get/:id').get(controller.getOneById);

//  Defined update route
router.route('/cancel/:id').put(controller.cancel);
router.route('/update/:id').put(controller.updateById);

// Defined delete | remove | destroy route
router.route('/delete/:id').delete(controller.deleteById);

module.exports = router;
