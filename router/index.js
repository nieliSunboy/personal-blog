
var express = require('express');
var router = express.Router();

// var userLogin = require('../control/userLogin')
var userRouter = require('../control/user')

router.use('/login', userRouter.login);
router.use('/register', userRouter.register);

module.exports = router