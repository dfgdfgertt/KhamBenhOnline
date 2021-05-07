
var express = require("express");
var app = express();
var Database = require('./database/connect');
const bodyParser = require('body-parser');
const PORT = 9000;
const cors = require('cors');

const FacultyRoute = require('./routes/facultyRoute');
const RoleRoute = require('./routes/roleRoute');
const AccountRoute = require('./routes/accoutRoute');
const UserRoute = require('./routes/userRoute');
const MemberRoute = require('./routes/memberRoute');
const DoctorRoute = require('./routes/doctorRoute');
const LoginRoute = require('./routes/loginRoute');
const Diagnostic = require('./routes/diagnosticRoute');
const Booking = require('./routes/bookingRoute');

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


app.listen(PORT, function() {
    console.log('Starting at Port:',PORT);
});
 
app.get("/", function(request, response)  {
    
    response.render("home");
});
 