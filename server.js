var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    routes = require('./app/routes'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    expressErrorHandler = require('express-error-handler'),
    app = express();

var MongoStore = require('connect-mongo')(expressSession);

var oauth = require('./oauth.js');
var passport = require('passport');

//connect to the db server:
var connection = mongoose.connect('mongodb://localhost/MyApp');

app.set('port', process.env.PORT || 3301);
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: app.get('views') + '/layouts'
}));
app.set('view engine', 'handlebars');

passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(obj, done) { done(null, obj); });

app.use(expressSession({
    secret: 'apovu4b0g=8429IG4PB',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

passport.use(oauth.facebook);
passport.use(oauth.twitter);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride());
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/img/', express.static(path.join(__dirname, '/client/images')));
app.use('/fonts/', express.static(path.join(__dirname, '/client/fonts')));

// development only
if ('development' == app.get('env')) {
    app.use(expressErrorHandler());
}

//routes list:
routes.initialize(app);

//finally boot up the server:
http.createServer(app).listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});
