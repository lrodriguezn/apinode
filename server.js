var express     = require('express'),
	  app         = express(),
    bodyParser  = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose  = require('mongoose'),
    morgan     = require("morgan"),
    jwt   = require("jsonwebtoken");

app.set('port', (process.env.PORT || 5000));

//var dbconnect=process.env.MONGO_URL_LOCAL; //base local
var dbconnect=process.env.MONGO_URL; //base de datos alojada en mLab

// Connection to DB
mongoose.connect(dbconnect, function(err, res) {
  if(err){
    console.log(dbconnect); 
    throw err;
  } 
  console.log('Connected to Database:' + dbconnect);
});

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

// Import Models and controllers
var user     = require('./models/users');
var UsersCtrl = require('./controllers/users.controller');
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
//RouterUsers.post('/authenticate',UsersCtrl.authenticate);
//RouterUsers.route('/signin').post(UsersCtrl.signin);
RouterUsers.route('/authenticate').post(UsersCtrl.authenticate);
app.use('/user', RouterUsers);

// API routes Clubs publicas
var RouterClubs = express.Router();
//RouterClubs.route('/listclubs').get(ClubsCtrl.list_clubs);
RouterClubs.get('/listclubs',ClubsCtrl.list_clubs);

// API routes Clubs privadas se valida con token. Route Middleware
RouterClubs.post('/eventos',ensureAuthorized, ClubsCtrl.list_clubevents );
app.use('/clubs', RouterClubs);

process.on('uncaughtException', function(err) {
    console.log(err);
});

// Start server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function ensureAuthorized(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['Authorization'];
  
  if (token) {

    try {

      var decoded = jwt.verify(token, process.env.JWT_SECRET,{complete: true});

      console.log("payload:" + decoded.login)

    } catch(err) {
          return res.json({
              success: false,
              data: "Error verify token: " + err
          });    
    }
    next();
  }
  else{
    return res.json({ success: false, data: 'There is no authenticate token' });
  }
  
}
