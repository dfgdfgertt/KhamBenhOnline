const express = require('express');
const router = express.Router();
const controller = require('./../controller/statisticController');

//link: http://localhost:9000/api/statistic/


// Defined get route
router.route('/getStatisticsFacultyByYear/:year').get(controller.StatisticsFacultyByYear);


module.exports = router;
