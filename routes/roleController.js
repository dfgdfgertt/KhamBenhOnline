const express = require('express');
const router = express.Router();
const Role = require('./../database/table/role');


// Defined store route
router.route('/').post(function (req, res) {
    let role = new Role(req.body);
    role.save()
        .then(role => {
            res.status(200).json({'role': 'create successfully'});
            console.log('post complete');
            console.log(role);
            console.log('');
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
            console.log('post error');
            console.log(role);
            console.log('');
        });
});

// Defined get data(index or listing) route
router.route('/').get(function (req, res) {
    Role.find(function(err, roles){
        if(err){
            console.log(err);
        }
        else {
            res.json(roles);
            console.log('get all complete');
            console.log(roles);
            console.log('');
        }
    });
});

// Defined get route
router.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Role.findById(id, function (err, role){
        if (!role){
            res.status(404).send("data is not found");
            console.log('get error');
            console.log(req.params.id);
            console.log('');
        }
        else {
            res.json(role);
            console.log('get complete');
            console.log(role);
            console.log('');
        }
    });
});

//  Defined update route
router.route('/:id').put(function (req, res) {
    Role.findById(req.params.id, function(err, role) {
        if (!role){
            res.status(404).send("Data is not found");
            console.log('Put error');
            console.log(req.params.id);
            console.log('');
        }
        else {
            role.name = req.body.name;
            role.save().then(business => {
                res.json('Update complete');
            })
                .catch(err => {
                    res.status(400).send("unable to update the database");
                });
            console.log('Update complete');
            console.log(role);
            console.log('');
        }
    });
});

// Defined delete | remove | destroy route
router.route('/:id').delete(function (req, res) {
    Role.findByIdAndRemove({_id: req.params.id}, function(err, person){
        if(err){
            res.status(404).send("Data is not found");
            //res.json(err);
            console.log('delete error');
            console.log(req.params.id);
            console.log('');
        }
        else{
            res.json('Successfully removed');
            console.log('Successfully removed');
            console.log(person);
            console.log('');
        }
    });
});

module.exports = router;
