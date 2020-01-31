var path = require('path');
var mongoose = require('mongoose');
var keys = require('./config/key');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var express = require('express');
var app = express();


//connect to db
mongoose.connect(keys.mongoURI);

//init app


//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
// connect-Flash
app.use(cookieParser());

app.use(flash());

app.use(function(req, res, next) {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
//set global errors variables
app.locals.errors = null;

//parse application/json
app.use(bodyParser.json());

//Body Parser middleware
//parse application /x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));



app.use(function(req, res, next) {
    res.locals.user = req.user
    next();
})

//Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


var user = require('./routes/user/authentication.js');
var userDashboard = require('./routes/user/dashboard.js');
var complaint = require('./routes/user/complaint.js');
var auth = require('./routes/head/auth.js');
var headDashboard = require('./routes/head/headDashboard.js');
var headComplaints = require('./routes/head/complaint.js');
var knowledge = require('./routes/head/knowledgebase.js');
var student = require('./routes/admin/student.js');
var fhead = require('./routes/admin/fhead.js');

app.use('/', user);
app.use('/dashboard', userDashboard);
app.use('/complaint', complaint);
app.use('/head-auth', auth);
app.use('/head-dashboard', headDashboard);
app.use('/student-complaints', headComplaints);
app.use('/knowledgebase', knowledge);
app.use('/students', student);
app.use('/facility-head', fhead);

var port = 3000;
app.listen(port, function() {
    console.log('server started on port' + port);
});

module.exports = app;