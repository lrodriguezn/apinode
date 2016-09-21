var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema   = new Schema({
    identity:String,
    login:String,
    first_name:String,
    last_name:String,
    email: String,
    password: String,
    token: String
});

module.exports = mongoose.model('users', userSchema);