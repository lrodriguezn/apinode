var fs = require("fs");

exports.listclubs = function(req, res) {
    var t=__dirname + '/../data/clubs.json'
    console.log("procesando...." + t);
   //fs.readFile(__dirname + "/data/" + "clubs.json", 'utf8', function (err, data) {
    fs.readFile(__dirname + '/../data/clubs.json', 'utf8', function (err, data) {
      console.log(err);
      console.log("datos:" + data );
	  res.header("Content-Type", "application/json");
      res.end(data);
   });    
};

exports.listclubs2 = function(req, res) {
    console.log("get listclubs2");
   fs.readFile( __dirname + "/data/" + "clubs2.json", 'utf8', function (err, data) {
      console.log(data );
	  res.header("Content-Type", "application/json");
      res.end(data);
   });  
};