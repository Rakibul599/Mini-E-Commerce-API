const express = require('express');
const { registerUser,loginUser } = require('../controllers/auth.controller');
const { newUservalidators,newUserValidationHandler } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register',newUservalidators,newUserValidationHandler, registerUser);
router.post('/login',loginUser);

module.exports = router;