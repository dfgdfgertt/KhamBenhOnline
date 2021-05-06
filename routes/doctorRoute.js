const express = require('express');
const router = express.Router();
const controller = require('./../controller/doctorcontroller');

//link: http://113.173.154.51:9000/api/doctor/
//link: http://localhost:9000/api/doctor/

// Defined store route
router.route('/create').post(controller.create);
router.route('/admin/create').post(controller.createByAdmin);

// Defined get data(index or listing) route
router.route('/get').get(controller.getAll);

// Defined get route
router.route('/get/:id').get(controller.getOneById);

// Get by facultyid
router.route('/getbyfaculty/:id').get(controller.getByFaculty);

//  Defined update route
router.route('/update/:id').put(controller.updateById);

// Defined delete | remove | destroy route
router.route('/delete/:id').delete(controller.deleteById);

module.exports = router;