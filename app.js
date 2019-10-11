var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var expectCt = require('expect-ct')
var validator  = require('express-validator');

var port = process.env.PORT || 9092;

// connect to MongoDB
mongoose.connect("mongodb+srv://supakornbabe:babe3000@cluster0-txdl5.gcp.mongodb.net/test?retryWrites=true");
// mongoose.connect('mongodb://mongo:27017/testForAuth');
var db = mongoose.connection;

// handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});

// use helmet for protection
var helmet = require('helmet')
app.use(helmet())
app.disable('x-powered-by')
app.set('trust proxy', 1)

// Sets "X-DNS-Prefetch-Control: off".
app.use(helmet.dnsPrefetchControl())

// Sets Expect-CT: enforce, max-age=123
app.use(expectCt({
    enforce: true,
    maxAge: 2592000
}))

// X-Frame-Options 
const frameguard = require('frameguard')

// Don't allow me to be in ANY frames:
app.use(frameguard({ action: 'deny' }))

// use sessions for tracking logins
app.use(session({
    secret: 'NetworkSecurityLoginPage',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(validator());
app.use(function(req, res, next) {
  for (var item in req.body) {
    req.sanitize(item).escape();
  }
  next();
});

// serve static files from template
app.use(express.static(__dirname + '/templateLogReg'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

// listen on port 3000
app.listen(port);
console.log('The magic happens on port ' + port);

// @TODO TEST
// @TODO #1 TEST1
// @TODO #2 TEST2
// @TODO #3 TEST3
