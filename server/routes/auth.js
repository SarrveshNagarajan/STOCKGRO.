const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');

// const {test} = require('../routes/controller');

const User = require('../models/user');

const router = express.Router();




router.post('/signup',async (req,res) => {
    const {email, password, confirmpassword} = req.body;

    if(password !== confirmpassword){
        return res.status(400).json({message:'Passwords do not match'});
    }

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }

        const hashedPswd = await bcrypt.hash(password,10);

        const newUser = new User({email,password:hashedPswd});
        await newUser.save();

        res.status(201).json({message:'User created successfully'});
    } catch(error){
        res.status(500).json({message:'Error signing up ',error});
    }
});


router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message:'User not found'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message:'Invalid credentials'});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({message: 'Login successful', token}); // Include token here
    } catch(error) {
        res.status(500).json({message: 'Error logging in', error});
    }
});


router.post('/predict', async(req,res) => {
    const { ticker, days } = req.body;

    if (!ticker || !days) {
        return res.status(400).json({ error: 'Ticker and days are required' });
    }

    try {
        const response = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, {
            ticker,
            days
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error calling ML service:', error.message);
        res.status(500).json({ error: 'Failed to get prediction from ML service' });
    }
});

router.get('/user', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;