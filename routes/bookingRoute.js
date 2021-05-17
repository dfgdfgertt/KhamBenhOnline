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
router.route('/member/get/:id').get(controller.getBookingByIdMember);
router.route('/doctor/get/:id').get(controller.getBookingByIdDoctor);
router.route('/faculty/get/:id').get(controller.getBookingByIdFaculty);

//  Defined update route
router.route('/cancel/:id').put(controller.cancel);
router.route('/update/:id').put(controller.updateById);

// Defined delete | remove | destroy route
router.route('/delete/:id').delete(controller.deleteById);

module.exports = router;
