const express = require('express');
const router = express.Router();
const controller = require('./../controller/loginController');

//link: http://113.173.154.51:9000/api/login/
//link: http://localhost:9000/api/login/

// Defined store route
router.route('/log').post(controller.login);
router.route('/gg').post(controller.loginGGAccount);

router.route('/changepassword/:id').put(controller.changePassword);

router.route('/forgotpassword').post(controller.forgotpasswordOTP);

// Step 2: /changepasswordforgot/:id
// req{
//     "newpassword" : "123456"
// }
// this step is change password to login
router.route('/changepasswordforgot/:id').put(controller.changepasswordforgot);

module.exports = router;
