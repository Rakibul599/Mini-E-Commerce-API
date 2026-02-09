const User = require('../model/User');
const bcrypt = require('bcrypt');
async function registerUser(req, res) {
   
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role || 'customer'
    });
    try {
        newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}

module.exports = { registerUser };