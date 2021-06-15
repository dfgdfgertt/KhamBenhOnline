const Faculty = require('./../database/table/faculty');
const Booking = require('./../database/table/booking');
const Order = require('./../database/table/order');

const StatisticsBookingByYear = function (req, res) {
    Faculty.find(async function (err, facultys){
        if (err) {
            res.status(400).send({"message":"Không tìm thấy dữ liệu khoa."});
            console.log(err);
            return;
        } else {
            var statistic = [0,0,0,0,0,0,0,0,0,0,0,0];
            let count = 0;
            for (const element of facultys) {
                Booking.find({idFaculty: element._id}, function(err, books) {
                    if (err) {
                        res.status(400).send({"message":"Sai định dạng mã khoa."});
                        console.log(err);
                        return;
                    } else {
                        books.forEach(async function(element, index ) {
                            let result = element.day.split("/");
                            if (req.params.year == result[2]) {
                                statistic[result[1]-1]++;
                            }
                        });
                        count ++;
                        if (count  == facultys.length) {
                            res.status(200).json(statistic);
                            return;
                        }
                    }
                })
               
            }
        }
    })
 
}

const StatisticsBookingOfFacultyByYear = function (req, res) {
    Faculty.find(async function (err, facultys){
        if (err) {
            res.status(400).send({"message":"Không tìm thấy dữ liệu khoa."});
            console.log(err);
            return;
        } else {
            var results = [];
            for (const element of facultys) {
                Booking.find({idFaculty: element._id}, function(err, books) {
                    if (err) {
                        res.status(400).send({"message":"Sai định dạng mã khoa."});
                        console.log(err);
                        return;
                    } else {
                        let total = 0;
                        books.forEach( function(element, index ) {
                            let result = element.day.split("/");
                            if (req.params.year == result[2]) {
                                total++
                            }
                        });
                        let faculty = element.name;
                        results.push({faculty,total})
                        if (results.length  == facultys.length) {
                            res.status(200).json(results);
                            return;
                        }
                    }
                })
              }
        }
    })
}


const StatisticsSalesByYear =async function (req, res) {
    var statistic = [0,0,0,0,0,0,0,0,0,0,0,0];
    let count = 0;
    let recount = 0;
    Faculty.find(async function (err, facultys){
        if (err) {
            res.status(400).send({"message":"Không tìm thấy dữ liệu khoa."});
            console.log(err);
            return;
        } else {
            for (const element of facultys) {
                Booking.find({$and:[{idFaculty: element._id},{status: true}]}, function(err, books) {
                    if (err) {
                        res.status(400).send({"message":"Sai định dạng mã khoa."});
                        console.log(err);
                        return;
                    } else {
                        recount+=books.length;
                        for (const book of books){
                            let result = book.day.split("/");
                            if (req.params.year == result[2]) {
                                 Order.findOne({$and:[{idBooking: book._id},{status: true}]}, function (err, order) {
                                    if (err) {
                                        res.status(400).send({"message":"Sai định dạng trạng thái thanh toán."});
                                        console.log(err);
                                        return;
                                    } else {
                                        count++;
                                        if (order) {
                                            statistic[result[1]-1]+=order.price;
                                        } 
                                        if (count == recount) {
                                            res.status(200).json(statistic);
                                            return;
                                        }
                                    }
                                })
                            }
                           
                        }
                    }
                })
            }
        }
    })
   
}

module.exports = {
    StatisticsBookingByYear,
    StatisticsBookingOfFacultyByYear,
    StatisticsSalesByYear
};