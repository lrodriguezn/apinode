var express = require('express');
var app = express();
var fs = require("fs");
var cors = require('cors');

app.use(function(req, res, next) {
	console.log("inicio Headers");
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept");
next();
});

app.get('/products', function(req, res, next){
	console.log('procesando products');
	console.log(res.header);
	
	res.json({msg: 'This is CORS-enabled for all origins!'});
  
});

/*
CORS on ExpressJS
https://www.thepolyglotdeveloper.com/2014/08/bypass-cors-errors-testing-apis-locally/
http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-node-js

EJEMPLO
http://nolaborables.com.ar/API/v1/proximo
*/
/*
var cors = require('cors');

//app.user(bodyParser.json());
// after the code that uses bodyParser and other cool stuff
//https://medium.com/@ahsan.ayaz/how-to-handle-cors-in-an-angular2-and-node-express-applications-eb3de412abef#.qnxmxib1f
//https://www.thepolyglotdeveloper.com/2014/08/bypass-cors-errors-testing-apis-locally/
var originsWhitelist = [
  'http://localhost:5000',      //this is my front-end url for development
   'http://www.myproductionurl.com'
];
var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials:true
}

//here is the magic
app.use(cors(corsOptions));
*/


/*
app.use(function(req, res, next) {
  console.log("demo access");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/

app.get('/listclubs', function (req, res) {
	console.log("get listclubs");
   
   
   fs.readFile( __dirname + "/data/" + "clubs.json", 'utf8', function (err, data) {
      console.log(data );
	  res.header("Content-Type", "application/json");
      res.end(data);
   });

   /*
	var stringjson="[{'code': '001','name': 'Club Campestre de Cali'},{'code': '002','name2': 'Club2'}]" ;
	console.log(stringjson);
    res.send(stringjson);
	*/
})

app.get('/listclubs2', function (req, res) {
	console.log("get listclubs2");
   
   
   fs.readFile( __dirname + "/data/" + "clubs2.json", 'utf8', function (err, data) {
      console.log(data );
	  res.header("Content-Type", "application/json");
      res.end(data);
   });

   /*
	var stringjson="[{'code': '001','name': 'Club Campestre de Cali'},{'code': '002','name2': 'Club2'}]" ;
	console.log(stringjson);
    res.send(stringjson);
	*/
})


app.get('/', function (req, res) {
   
    console.log("get base de datos");
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sanomina',
        password: 'ZEUSTEC',
        server: 'ZEUS48\\SQL2012DV', 
        database: 'Zeus_NominaDesarrollo' 
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select identificacion, nombres from nm_empleado', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
			console.log(recordset);
            res.send(recordset);
            
        });
    });
});


var server = app.listen(5000, function () {
    console.log('Server is running..');
});