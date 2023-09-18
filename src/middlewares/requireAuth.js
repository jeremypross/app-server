const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

// if we determine there's a valid JWT - next () is a signal the request can move onto the next middleware in a chain of middlewares or run the our ultimate request handler
module.exports = (req, res, next) => {
    // pull off authorization header from the request
    const { authorization } = req.headers;
    // if there's no authorization header - this is not a valid request
    if (!authorization) {
        return res.status(401).send({ error: 'You must be logged in.' });
    }

    // store token by replacing 'Bearer ' with an empty string
    const token = authorization.replace('Bearer ', '');
    // verify token - 1st arg is token to validate, second arg is our secret key, 3rd is callback to run after jwt has run validation - function called with error if something went wrong with verification process, but if everthing is ok we will get payload (payload is info in our JWT)
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        // error checking
        if (err) {
            return res.status(401).send({ error: 'You must be logged in.' });
        }
        const { userId } = payload;
        // tells mongoose to find user with given ID and assign that user to this variable
        const user = await User.findById(userId);
        // take that user and assign to req object
        req.user = user;
        // run next middleware
        next();
    });

};