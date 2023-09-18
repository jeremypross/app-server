const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// schema tells mongoose object structure
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, 
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// presave hook - a function that will run before we attempt to save a new user instance in our mongo db
// will make sure we always salt and hash a password everytime we do this
// using function() instead of an arrow function becuase we want to use this with context only for this presave function
userSchema.pre('save', function(next) {
    const user = this;
    // if user hasn't changed their password - don't salt anything and move on (next())
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        // if error
        if (err) {
            return next(err);
        }

        // we will call bcrypt library and pass in our password, and salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    })
});

// logic to automate password checking process - compares provided password to pw inside our db
// still need function() so this isn't context of this file, only this function's scope
userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;
    // creating promise so we can use async await here
    // bcrypt library relies on callbacks entirely which is old and janky so that's why we're using a promise here
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            if (!isMatch) {
                return reject(false);
            }
            resolve(true);
        });
    });
}


// associates user schema with mongoose library
mongoose.model('User', userSchema);