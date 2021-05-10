const express = require('express');
const router = express.Router();
//const Role = require('./../database/table/role');
const Account = require('./../controller/accountController');

//link: http://113.173.154.51:9000/api/account/
//link: http://localhost:9000/api/account/

// Defined store route
router.route('/create').post(Account.create);
router.route('/admin/create').post(Account.createByAdmin);

// Defined get data(index or listing) route
router.route('/get').get(Account.getAll);

// Defined get route
router.route('/get/:id').get(Account.getOneById);

//  Defined update route
router.route('/update/:id').put(Account.updateById);

// Defined delete | remove | destroy route
router.route('/delete/:id').delete(Account.deleteById);

module.exports = router;
