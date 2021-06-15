const Faculty = require('./../database/table/faculty');
const Booking = require('./../database/table/booking');

const StatisticsFacultyByYear = function (req, res) {
    Faculty.find( function (err, facultys){
        if (err) {
            res.status(400).send({"message":"Không tìm thấy dữ liệu khoa."});
            console.log(err);
            return;
        } else {
            let arr = []
            facultys.forEach(async function(element, index ) {
                var statistic = [0,0,0,0,0,0,0,0,0,0,0,0];
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
                        var faculty = facultys[index].name;
                        arr.push({faculty,statistic});
                    }
                })
               if (index == (facultys.length-1)) {
                    console.log(arr)
                    res.status(200).json(arr);
                    return;
               }
            })
         
        }
    })
 
}

module.exports = {
    StatisticsFacultyByYear 
};