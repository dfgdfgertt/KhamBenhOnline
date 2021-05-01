const express = require('express');
const router = express.Router();
const controller = require('./../controller/loginController');

//link: http://113.173.154.51:9000/api/login/
//link: http://localhost:9000/api/login/

// Defined store route
router.route('/log').post(controller.login);

router.route('/changepassword/:id').post(controller.changePassword);

//forgot have 2 step:
// Step 1: /forgotpassword  
//req{
//     "username" : "username",
//     "forgot" : "email or phone number"
// }
// res{
//     "message": "successfully",
//     "idAccount": "id here"
// }
// this step is validate the username & email or phone number
router.route('/forgotpassword').post(controller.forgotpassword);

// Step 2: /changepasswordforgot/:id
// req{
//     "newpassword" : "123456"
// }
// this step is change password to login
router.route('/changepasswordforgot/:id').post(controller.changepasswordforgot);

module.exports = router;
