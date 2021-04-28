const express = require('express');
const chalk = require('chalk');
const router = express.Router();
//const Role = require('./../database/table/role');
const Account = require('./../database/table/account');


// Defined store route
router.route('/').post(function (req, res) {
    let account = new Account(req.body);
    account.save()
        .then(account => {
            res.status(200).json({'account': 'create successfully'});
            console.log(chalk.green('post complete'));
            console.log(account);
            console.log('');
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
            console.log(chalk.red('post error'));
            console.log(err);
            console.log('');
        });
});

// Defined get data(index or listing) route
router.route('/').get(function (req, res) {
    Account.find(function(err, accounts){
        if(err){
            console.log(err);
        }
        else {
            res.json(accounts);
            console.log(chalk.green('get all complete'));
            console.log(accounts);
            console.log('');
        }
    });
});

// Defined get route
router.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Account.findById(id, function (err, account){
        if (!account){
            res.status(404).send("data is not found");
            console.log(chalk.red('get error'));
            console.log(req.params.id);
            console.log('');
        }
        else {
            res.json(account);
            console.log(chalk.green('get complete'));
            console.log(account);
            console.log('');
        }
    });
});

//  Defined update route
router.route('/:id').put(function (req, res) {
    Account.findById(req.params.id, function(err, account) {
        if (!account){
            res.status(404).send("Data is not found");
            console.log(chalk.red('Put error'));
            console.log(req.params.id);
            console.log('');
        }
        else {
            account.userName = req.body.userName;
            account.password = req.body.password;
            account.idRole = req.body.idRole;
            account.save().then(business => {
                res.json('Update complete');
            })
                .catch(err => {
                    res.status(400).send("unable to update the database");
                });
            console.log(chalk.green('Update complete'));
            console.log(account);
            console.log('');
        }
    });
});

// Defined delete | remove | destroy route
router.route('/:id').delete(function (req, res) {
    Account.findByIdAndRemove({_id: req.params.id}, function(err, person){
        if(err){
            res.status(404).send("Data is not found");
            //res.json(err);
            console.log(chalk.red('delete error'));
            console.log(req.params.id);
            console.log('');
        }
        else{
            res.json('Successfully removed');
            console.log(chalk.green('Successfully removed'));
            console.log(person);
            console.log('');
        }
    });
});

module.exports = router;
