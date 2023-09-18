const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const router = express.Router();

router.post('/signup', async (req, res) => {
    // destructure properties out of req.body user object in incoming data
    const { email, password } = req.body;

    try {
        // create a new instance of a user, and assign it these properties from req.body
        const user = new User({ email, password });
        // tell mongoDB instance to save this user instance
        await user.save();
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        res.send({ token });
    } catch (err) {
        // invalid data
        return res.status(422).send(err.message);
    }
});

// as usual this callback will be invoided with request and response objects
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    // error checking
    if (!email || !password ) {
        return res.status(422).send({ error: 'Must provide email and password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ error: 'Email not found' }); 
    }
    try {
        await user.comparePassword(password);
        // generate jwt and send it to user so they can use it to authenticate on future requests
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        // send token
        res.send({ token });
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
});

module.exports = router;