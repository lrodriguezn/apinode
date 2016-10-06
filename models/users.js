var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema   = new Schema({
    identity:String,
    login:String,
    first_name:String,
    last_name:String,
    email: String,
    password: String,
	clubs:String
   // token: String
});

var clubSchema   = new Schema({
	code: String,
	name: String,
	description:String,
	country:String,
	city:String, 
	address:String,
	urlApi:String,
	urlImage:String,
	location:String,
	active:Boolean,
	user_type:String,
	user_membership_id:String,
	user_pass:String,
	user_token:String
});


module.exports = mongoose.model('users', userSchema);
module.exports = mongoose.model('clubs', clubSchema);