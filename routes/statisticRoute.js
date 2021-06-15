const express = require('express');
const router = express.Router();
const controller = require('./../controller/statisticController');

//link: http://localhost:9000/api/statistic/


// Defined get route
router.route('/StatisticsBookingByYear/:year').get(controller.StatisticsBookingByYear);

router.route('/StatisticsBookingOfFacultyByYear/:year').get(controller.StatisticsBookingOfFacultyByYear);

router.route('/StatisticsSalesByYear/:year').get(controller.StatisticsSalesByYear);

module.exports = router;
