//File: controllers/userctrl.js
var jwt   = require("jsonwebtoken"); //https://www.npmjs.com/package/jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
var moment = require('moment'); 
var USER_COLLECTION = "users";

exports.signin = function(req, res) {
    try 
    {
        
        if (!(req.body.login)) {
            handleError(res, "Invalid login input", "Must provide a login.", 400);
            return;
        }

        if (!(req.body.password)) {
            handleError(res, "Invalid password input", "Must provide a password.", 400);
            return;
        }

        if (!(req.body.identity)) {
            handleError(res, "Invalid identity input", "Must provide a identity.", 400);
            rerurn;
        }

        if (!(req.body.email)) {
            handleError(res, "Invalid email input", "Must provide a email.", 400);
            return;
        }

        var usertoken = jwt.sign({ login:  req.body.login.toLowerCase() }, process.env.JWT_SECRET);
        var passEncriptada = encrypt(req.body.login.toLowerCase(), req.body.password);
        
        var newUser = req.body;
        newUser.createDate = new Date();
        newUser.login=req.body.login.toLowerCase();
        newUser.password=passEncriptada;
        newUser.confirmpassword="";

        db.collection(USER_COLLECTION).findOne({login:req.body.login.toLowerCase()},function(err, user) 
        {
            if (err) 
            {
                handleError(res, err.message, "Failed to signin user.");
            } 
            else 
            {
                if (user)
                {
                    handleError(res, "User already exists!", "User already exists!",200);
                }
                else
                {
                    db.collection(USER_COLLECTION).insertOne(newUser, function(err, doc) 
                    {
                        if (err) 
                        {
                            handleError(res, err.message, "Failed to create new contact.");
                        } 
                        else 
                        {
                            res.status(201).json({success: true,data:doc._id,token:usertoken});
                        }
                    });       
                }
                
            }
        });
    }     
    catch (error) 
    {
        handleError(res, error, "Error authenticate!");
    }
};

exports.authenticate = function(req, res) {
    try {

        if (!(req.body.login)) {
            handleError(res, "Invalid login input", "Must provide a login.", 400);
            return;
        }

        if (!(req.body.password)) {
            handleError(res, "Invalid password input", "Must provide a password.", 400);
            return;
        }

        var usertoken = jwt.sign({ login: req.body.login.toLowerCase() }, process.env.JWT_SECRET);
        var passEncriptada = encrypt(req.body.login.toLowerCase(), req.body.password);

        db.collection(USER_COLLECTION).findOne({login:req.body.login.toLowerCase()},function(err, user) 
        {
            if (err) 
            {
                handleError(res, err.message, "Failed to authenticate user.");
            } 
            else 
            {
                if (user)
                {
                    if (user.password==passEncriptada)
                    {
                        res.status(200).json({success: true,data:doc._id,token:usertoken});
                    }
                    else
                    {
                        handleError(res, "Incorrect password!", "Incorrect password!",200);
                    }
                }
                else
                {
                    handleError(res, "Incorrect login!", "Incorrect login!",200);
                }

                
            }
        });
        
    } 
    catch (error) 
    {
        handleError(res, error, "Error authenticate!");
    }
};

exports.updateuser = function(req, res) {
    try {

        // invalid token
        jwt.verify( req.body.token, process.env.JWT_SECRET, function(err, decoded) 
        {
            if (err)
            {
                handleError(res, err.message, "Failed to token user.");
                return;
            }
            else
            {
                db.collection(USER_COLLECTION).findOne({login:decoded.login},function(err, user) 
                {
                    if (err) 
                    {
                        handleError(res, err.message, "Failed to authenticate user.");
                    } 
                    else 
                    {
                        if (user)
                        {
                            user.clubs=req.body.clubs;
                            db.collection(USER_COLLECTION).updateOne({_id: user._id}, user, function(err, doc) {
                                if (err) 
                                {
                                    handleError(res, err.message, "Failed to update user");
                                } 
                                else 
                                {
                                    res.status(204).end();
                                }
                            });                            
                        }
                        else
                        {
                            handleError(res, "Incorrect user!", "Incorrect user!",200);
                        }

                        
                    }
                });
            }  
      });  
    } 
    catch (error) 
    {
        handleError(res, error, "Error authenticate!");
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

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
                
  //res.status(code || 500).json({"error": message});
  res.status(code || 500).json({success: false, "error": message});
}