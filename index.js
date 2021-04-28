
var express = require("express");
var app = express();
var Database = require('./database/connect');
const bodyParser = require('body-parser');
const PORT = 9000;
const cors = require('cors');

const khoaRoute = require('./routes/khoaController');
const RoleRoute = require('./routes/roleController');
const AccountRoute = require('./routes/accoutController');

app.use(express.static("public"));
 
app.set("view engine", "ejs");
app.set("views", "./views");
 
//use
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/khoa', khoaRoute);
app.use('/api/role', RoleRoute);
app.use('/api/account', AccountRoute);


app.listen(PORT, function() {
    console.log('Starting at Port:',PORT);
});
 
app.get("/", function(request, response)  {
    
    response.render("home");
});
 