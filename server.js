var express     = require('express'),
    app         = express(),
    bodyParser  = require("body-parser"),
    methodOverride  = require("method-override"),
    mongodb = require("mongodb"),
    morgan     = require("morgan"),
    path = require("path"),
    jwt   = require("jsonwebtoken");

var ObjectID = mongodb.ObjectID;

//var dbconnect=process.env.MONGO_URL_LOCAL; //base local
var dbconnect=process.env.MONGO_URL; //base de datos alojada en mLab

app.set('port', (process.env.PORT || 5000));

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(dbconnect, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  global.db=database;
  console.log("Database connection ready");

  // Initialize the app.
    // Start server
    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });
});


// Import Models and controllers
var user     = require('./models/users');
var UsersCtrl = require('./controllers/user.controller');
var ClubsCtrl = require('./controllers/clubs.controller');

// Probar router
var router = express.Router();
router.get('/', function(req, res) {
  res.status(200).jsonp({respuesta:'hola mundo'});
});
app.use(router);

// API routes users
var RouterUsers = express.Router();
RouterUsers.post('/signin',UsersCtrl.signin);
RouterUsers.route('/authenticate').post(UsersCtrl.authenticate);
RouterUsers.put('/updateuser',ensureAuthorized,UsersCtrl.updateuser);
app.use('/user', RouterUsers);

// API routes Clubs publicas
var RouterClubs = express.Router();
RouterClubs.get('/listclubs',ClubsCtrl.list_clubs);

// API routes Clubs privadas se valida con token. Route Middleware
RouterClubs.post('/eventos',ensureAuthorized, ClubsCtrl.list_clubevents );
app.use('/clubs', RouterClubs);

process.on('uncaughtException', function(err) {
    console.log(err);
});

function ensureAuthorized(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['Authorization'];
  
  if (token) {

    try {

      var decoded = jwt.verify(token, process.env.JWT_SECRET,{complete: true});

    } catch(err) {
          return res.json({
              success: false,
              error: "Error verify token: " + err
          });    
    }
    next();
  }
  else{
    return res.json({ success: false, error: 'There is no authenticate token' });
  }
  
}

