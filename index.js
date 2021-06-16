
var express = require("express");
var app = express();
var Database = require('./database/connect');
const bodyParser = require('body-parser');
const HttpPORT = 9000;
const HttpsPORT = 9001;
const cors = require('cors');
const fs = require("fs");
const https = require("https");

var key = fs.readFileSync(__dirname + '/config/certsFiles/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/config/certsFiles/selfsigned.crt');

var credentials = {
  key: key,
  cert: cert
};

var httpsServer = https.createServer(credentials, app);


const FacultyRoute = require('./routes/facultyRoute');
const RoleRoute = require('./routes/roleRoute');
const AccountRoute = require('./routes/accoutRoute');
const UserRoute = require('./routes/userRoute');
const MemberRoute = require('./routes/memberRoute');
const DoctorRoute = require('./routes/doctorRoute');
const LoginRoute = require('./routes/loginRoute');
const Diagnostic = require('./routes/diagnosticRoute');
const Booking = require('./routes/bookingRoute');
const Payment = require('./routes/paymentRoute');
const Statistic = require('./routes/statisticRoute');

app.use(express.static("public"));
 
app.set("view engine", "ejs");
app.set("views", "./views");
 
//use
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/faculty', FacultyRoute);
app.use('/api/role', RoleRoute);
app.use('/api/account', AccountRoute);
app.use('/api/user', UserRoute);
app.use('/api/member', MemberRoute);
app.use('/api/doctor', DoctorRoute);
app.use('/api/login', LoginRoute);
app.use('/api/diagnostic', Diagnostic);
app.use('/api/booking', Booking);
app.use('/api/payment', Payment);
app.use('/api/statistic', Statistic);


httpsServer.listen(HttpsPORT, () => {
    console.log("Https server listing on port:",HttpsPORT)
  });

app.listen(HttpPORT, function() {
    console.log('Http server listing on port:',HttpPORT);
});
 
app.get("/", function(request, response)  {
    response.render("home");
});
 