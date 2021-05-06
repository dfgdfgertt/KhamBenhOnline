const express = require('express');
const router = express.Router();
const controller = require('./../controller/memberController');

//link: http://113.173.154.51:9000/api/member/
//link: http://localhost:9000/api/member/

// Defined store route
router.route('/create').post(controller.create);
router.route('/admin/create').post(controller.createByAdmin);
// Defined get data(index or listing) route
router.route('/get').get(controller.getAll);

// Defined get route
router.route('/get/:id').get(controller.getOneById);

//  Defined update route
router.route('/update/:id').put(controller.updateById);

// Defined delete | remove | destroy route
router.route('/delete/:id').delete(controller.deleteById);

module.exports = router;