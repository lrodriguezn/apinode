//File: controllers/userctrl.js
var mongoose = require('mongoose');
var User  = mongoose.model('users');
var jwt   = require("jsonwebtoken");

exports.signin = function(req, res) {
    User.findOne({identity:req.body.identity,
                    password: req.body.password
                    },function(err, user){
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    res.json({
                        type: false,
                        data: "User already exists!"
                    });
                } else {
                    
                    var userModel = new User();
                        userModel.identity=req.body.identity,
                        userModel.login=req.body.login,
                        userModel.first_name=req.body.first_name,
                        userModel.last_name=req.body.last_name,
                        userModel.email=req.body.email,
                        userModel.password=req.body.password,
                    userModel.save(function(err, user) {
                        user.token = jwt.sign(user, process.env.JWT_SECRET);
                        user.save(function(err, user1) {
                            res.json({
                                type: true,
                                data: user1,
                                token: user1.token
                            });
                        });
                    })
                }
            }        
    });

};

exports.authenticate = function(req, res) {
    User.findOne({identity: req.body.identity, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
               res.json({
                    type: true,
                    data: user,
                    token: user.token
                }); 
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });    
            }
        }
    });   
};