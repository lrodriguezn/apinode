//File: controllers/userctrl.js
var mongoose = require('mongoose');
var User  = mongoose.model('users');
var jwt   = require("jsonwebtoken"); //https://www.npmjs.com/package/jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
var moment = require('moment'); 

exports.signin = function(req, res) {
    try 
    {
        var usertoken = jwt.sign({ login:  req.body.login }, process.env.JWT_SECRET);
        var passEncriptada = encrypt(req.body.login, req.body.password);
        User.findOne({login:req.body.login},function(err, user)
        {
            if (err) {
                res.json({
                    success: false,
                    data: "Error occured: " + err
                });
            } 
            else 
            {
                if (user) 
                {
                    res.json({
                        success: false,
                        data: "User already exists!"
                    });
                } 
                else 
                {
                    var userModel = new User();
                        userModel.identity=req.body.identity,
                        userModel.login=req.body.login,
                        userModel.first_name=req.body.first_name,
                        userModel.last_name=req.body.last_name,
                        userModel.email=req.body.email,
                        userModel.password=passEncriptada;
                        
                        userModel.save(function(err, user) 
                        {
                            user.save(function(err, user1) 
                            {
                                res.json({
                                    success: true,
                                    data: user1,
                                    token: usertoken
                                });

                            });
                        })
                }
            }        
        });
        
    }     
    catch (error) 
    {
        res.json({
            success: false,
            data: "Error signin... " + error
        });
    }


};

exports.authenticate = function(req, res) {
    try {

        var usertoken = jwt.sign({ login:  req.body.login }, process.env.JWT_SECRET);
        var passEncriptada = encrypt(req.body.login, req.body.password);

        User.findOne({login: req.body.login}, function(err, user) {
            if (err) 
            {
                res.json({
                    success: false,
                    data: "Error occured: " + err
                });
            }
            else
            {
                if (user) 
                {
                    if (user.password==passEncriptada)
                    {   
                        /*
                        var usertoken;
                        //jwt.sign(user.login, process.env.JWT_SECRET,{expiresIn:"10h"}, function(err, token) {
                        jwt.sign(user.login, process.env.JWT_SECRET, function(err, token) 
                        {
                            if(err)
                            {
                                return res.json({
                                            success: false,
                                            data: "Error process token. " + err
                                        });
                            }
                            usertoken=token;
                        });
                        */

                        res.json({
                            success: true,
                            data: user,
                            token:usertoken
                        });
                    }
                    else
                    {
                        res.json({
                                success: false,
                                data: "Incorrect pass"
                            }); 
                    }
                    
                }
                else
                {
                    res.json({
                        success: false,
                        data: "Incorrect login"
                    });                     
                }
            }

        });   
        
    } 
    catch (error) 
    {
        res.json({
            success: false,
            data: "Error authenticate... " + error
        });
    }
};


function encrypt(userid, pass) {
   var crypto = require('crypto')
   // usamos el metodo CreateHmac y le pasamos el parametro userid y actualizamos el hash con la password
   var hmac = crypto.createHmac('sha1', userid).update(pass).digest('hex')
   return hmac
}

function createToken(user) {
   return jwt.sign(user.login, process.env.JWT_SECRET,{expiresIn:"10h"});
}
