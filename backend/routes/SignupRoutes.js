const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ name });

        if(user){
            return res.status(409).json({ message: 'Username is already taken!' });
        }

        const newUser = new User({ name, password });
        await newUser.save();
        res.status(200).json({ message: 'User added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error, Please try again!' });
    }
});

module.exports = router;