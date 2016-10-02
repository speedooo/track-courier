var express = require('express');
var account_controller = require('./controllers/accounts.js');
var parcels_controller = require('./controllers/parcels.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var cors = require('cors');

var app = express();
var user_session = null;

// Middlewares
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'track_courier_application_secret_key',
    cookie: {
        maxAge: 60000
    },
    saveUninitialized: true,
    resave: true
}));

app.all('*parcels*', function(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        next(new Error(401));
    }
});

app.get('/', function(req, res) {
    res.status(200).send("Server Working!");
});

account_controller.set(app);
parcels_controller.set(app);

var port = Number(process.env.PORT || 8000)
app.listen(port);
console.log('Track-Courier Up and Running!');
