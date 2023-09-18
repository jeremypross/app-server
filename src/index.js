require('./models/User');
require('./models/Post');
// import express library by requiring it in
const express = require('express');
// import mongoose
const mongoose = require('mongoose');
// bodyparser handles incoming json data
 
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const requireAuth = require('./middlewares/requireAuth');

// create app object - this represents our entire application
const app = express();

// parse json before request handler in authRoutes
app.use(bodyParser.json());
// tell app to use authRoutes.js file to handle routing
app.use(authRoutes);
//tell app to use PostRoutes
app.use(postRoutes);

const mongoUri = 'mongodb+srv://admin:rx&g&Qe7EKGjiei$@cluster0.4zeqexe.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoUri);

// successful connection to mongo
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});
// error handling
mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err);
});

// when you make a get request to this route - call this function 
// run middlewhere whenever someone makes a request to this route - auth routes
app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`);  
});

app.listen(3000, () => {
    console.log('Listening on Port 3000');
});8