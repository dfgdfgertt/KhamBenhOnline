const express = require('express');
const router = express.Router();
const Khoa = require('./../database/khoa');


// Defined store route
router.route('/create').post(function (req, res) {
    let khoa = new Khoa(req.body);
    khoa.save()
        .then(khoa => {
            res.status(200).json({'khoa': 'khoa in create successfully'});
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

// Defined get data(index or listing) route
router.route('/get').get(function (req, res) {
    Khoa.find(function(err, khoas){
        if(err){
            console.log(err);
        }
        else {
            res.json(khoas);
        }
    });
});

// Defined edit route
router.route('/get/:id').get(function (req, res) {
    let id = req.params.id;
    Khoa.findById(id, function (err, business){
        res.json(business);
    });
});

//  Defined update route
router.route('/update/:id').put(function (req, res) {
    Khoa.findById(req.params.id, function(err, khoa) {
        if (!khoa)
            res.status(404).send("data is not found");
        else {
            console.log(khoa);
            khoa.name = req.body.name;
            khoa.logo = req.body.logo;
            khoa.description = req.body.description;

            khoa.save().then(business => {
                res.json('Update complete');
            })
                .catch(err => {
                    res.status(400).send("unable to update the database");
                });
        }
    });
});

// Defined delete | remove | destroy route
router.route('/delete/:id').delete(function (req, res) {
    Khoa.findByIdAndRemove({_id: req.params.id}, function(err, person){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = router;
