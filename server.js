var express     = require('express'),
	  app         = express(),
    bodyParser  = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose  = require('mongoose'),
    morgan     = require("morgan");

app.set('port', (process.env.PORT || 5000));
/*
// Connection to DB
mongoose.connect(process.env.MONGO_URL, function(err, res) {
  if(err){
    console.log(process.env.MONGO_URL); 
    throw err;
  } 
  console.log('Connected to Database');
});
*/
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
RouterUsers.route('/signin').post(UsersCtrl.signin);
RouterUsers.route('/authenticate').post(UsersCtrl.authenticate);
app.use('/user', RouterUsers);

// API routes Clubs
var RouterClubs = express.Router();
RouterClubs.route('/listclubs').get(ClubsCtrl.listclubs);
app.use('/clubs', RouterClubs);

process.on('uncaughtException', function(err) {
    console.log(err);
});

// Start server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
