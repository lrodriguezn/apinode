var express = require('express');
var app = express();
var fs = require("fs");

app.set('port', (process.env.PORT || 5000));

app.get('/listclubs', function (req, res) {
   fs.readFile( __dirname + "/data/" + "clubs.json", 'utf8', function (err, data) {
      console.log(data );
	  res.header("Content-Type", "application/json");
      res.end(data);
   });
})

app.get('/listclubs2', function (req, res) {
	console.log("get listclubs2");
   
   
   fs.readFile( __dirname + "/data/" + "clubs2.json", 'utf8', function (err, data) {
      console.log(data );
	  res.header("Content-Type", "application/json");
      res.end(data);
   });
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
