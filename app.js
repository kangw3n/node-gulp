var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.redirect('index.html');
});

app.get('*', function(req, res) {
  res.send('Error!');
});

var server = app.listen(8008);
