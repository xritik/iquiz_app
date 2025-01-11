const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ name, password });

        if(user){
            res.status(200).json({ message: 'Login Successful!' });
        }else{
            res.status(401).json({ message: 'Invalid name or password' });
        }
    } catch (error) {
        console.log('Error fetching uesr:- ', error);
        res.status(500).json({ message: 'Internal server error, Please try again!!' });
    }
})

module.exports = router;