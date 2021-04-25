var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Database = require('./db/database');

app.listen(3000, function() {
    console.log("Starting at port 3000...");
});