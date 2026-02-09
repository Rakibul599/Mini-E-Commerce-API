const express = require('express');
const { registerUser } = require('../controllers/registrationController');
const { newUservalidators,newUserValidationHandler } = require('../middleware/registrationValidators');

const router = express.Router();

router.post('/register',newUservalidators,newUserValidationHandler, registerUser);

module.exports = router;