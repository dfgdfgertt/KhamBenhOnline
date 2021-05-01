const express = require('express');
const router = express.Router();
const Faculty = require('./../controller/facultyController');

//link: http://113.173.154.51:9000/api/faculty/
//link: http://localhost:9000/api/faculty/

// Defined store route
router.route('/create').post(Faculty.create);

// Defined get data(index or listing) route
router.route('/get').get(Faculty.get);

// Defined edit route
router.route('/get/:id').get(Faculty.getOnebyId);

//  Defined update route
router.route('/update/:id').put(Faculty.updateById);

// Defined delete | remove | destroy route
router.route('/delete/:id').delete(Faculty.deleteById);

module.exports = router;
