const Faculty = require('./../database/table/faculty');
const Booking = require('./../database/table/booking');

const StatisticsBookingByYear = function (req, res) {
    Faculty.find( function (err, facultys){
        if (err) {
            res.status(400).send({"message":"Không tìm thấy dữ liệu khoa."});
            console.log(err);
            return;
        } else {
            var statistic = [0,0,0,0,0,0,0,0,0,0,0,0];
            facultys.forEach(async function(element, index ) {
                await Booking.find({idFaculty: element._id}, function(err, books) {
                    if (err) {
                        res.status(400).send({"message":"Sai định dạng mã khoa."});
                        console.log(err);
                        return;
                    } else {
                        books.forEach(function(element, index ) {
                            let result = element.day.split("/");
                            if (req.params.year == result[2]) {
                                statistic[result[1]-1]++;
                            }
                        });
                    }
                })
               if (index == (facultys.length-1)) {
                    res.status(200).json(statistic);
                    return;
               }
            })
         
        }
    })
 
}

const StatisticsBookingOfFacultyByYear = function (req, res) {
    Faculty.find( function (err, facultys){
        if (err) {
            res.status(400).send({"message":"Không tìm thấy dữ liệu khoa."});
            console.log(err);
            return;
        } else {
            var results = [];
            facultys.forEach(async function(element, index ) {
                await Booking.find({idFaculty: element._id}, function(err, books) {
                    if (err) {
                        res.status(400).send({"message":"Sai định dạng mã khoa."});
                        console.log(err);
                        return;
                    } else {
                        let total = 0;
                        books.forEach(function(element, index ) {
                            let result = element.day.split("/");
                            if (req.params.year == result[2]) {
                                total++
                            }
                        });
                        let faculty = facultys[index].name;
                        results.push({faculty,total})

                    }
                })
               if (index == (facultys.length-1)) {
                    res.status(200).json(results);
                    return;
               }
            })
         
        }
    })
 
}

module.exports = {
    StatisticsBookingByYear,
    StatisticsBookingOfFacultyByYear
};