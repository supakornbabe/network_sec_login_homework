var mongoose = require('mongoose');
var hash = require('hash.js');
var UserSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
});

//authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({
            username: username
        })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            let checkpass = hash.sha256().update(password).digest('hex');
            if (checkpass === user.password) {
                return callback(null, user);
            } else {
                return callback();
            }
        });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    let enc = hash.sha256().update(this.password).digest('hex');
    user.password = enc;
    next();
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
