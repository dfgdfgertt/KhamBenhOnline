const express = require('express');
const router = express.Router();
const controller = require('./../controller/diagnosticController');

//link: http://113.173.154.51:9000/api/diagnostic/
//link: http://localhost:9000/api/diagnostic/

// Defined store route
//router.route('/create').post(controller.createsymptom);

// Defined get data(index or listing) route
router.route('/get').get(controller.getAll);

// Defined get route
router.route('/get/:id').get(controller.getOneById);

//  Defined update route
router.route('/update/:id').put(controller.updateById);

// Defined delete | remove | destroy route
router.route('/delete/:id').delete(controller.deleteById);

//search diagnostic {"symptom":"value"}
router.route('/searchdiagnostic').post(controller.searchDiagnostic);

module.exports = router;
