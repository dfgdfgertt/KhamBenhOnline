var express = require("express");

var app = express();
var Database = require('./database/connect');

 
app.use(express.static("public"));
 
app.set("view engine", "ejs");
app.set("views", "./views");
 
app.listen(9000, function() {
    console.log("Starting at port 9000...");
});
 
app.get("/", function(request, response)  {
    
    response.render("home");
});
 