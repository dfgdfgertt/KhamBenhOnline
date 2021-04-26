var express = require("express");
var app = express();
var Database = require('./database/connect');
const bodyParser = require('body-parser');
const PORT = 9000;
const cors = require('cors');

const khoaRoute = require('./controller/khoaController');
 
app.use(express.static("public"));
 
app.set("view engine", "ejs");
app.set("views", "./views");
 
//use
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/khoa', khoaRoute);

app.listen(PORT, function() {
    console.log('Starting at Port:',PORT);
});
 
app.get("/", function(request, response)  {
    
    response.render("home");
});
 