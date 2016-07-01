var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var routes = require('./app/routes');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var app = express();

var i18next = require('i18next');
var middleware = require('i18next-express-middleware');
var Backend = require('i18next-node-fs-backend');

var i18nText = require('i18next-text');

var hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: app.get('views') + '/layouts',
    helpers: {
        i18n: i18nText.handlebarsHelper
    }
});

var options = {
    lngs: ['en', 'ru-RU'],
    resGetPath: 'locale/i18n/__lng__/__ns__.json',
    debug: true,
    backend: {
        loadPath: 'locale/i18n/{{lng}}/{{ns}}.json'
    }
};

i18nText.init();

i18next
    .use(middleware.LanguageDetector)
    .use(Backend)
    .init(options);

var MongoStore = require('connect-mongo')(expressSession);

var oauth = require('./oauth.js');
var passport = require('passport');

//connect to the db server:
var connection = mongoose.connect('mongodb://localhost/MyApp');

app.set('port', process.env.PORT || 3302);
app.set('views', __dirname + '/views');
app.engine('handlebars', hbs.engine);
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
passport.use(oauth.email);
passport.use(oauth.vk);
app.use(passport.initialize());

app.use(passport.session());

app.use(middleware.handle(i18next, {
    removeLngFromUrl: false
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride());
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'staging/1')));
app.use('/locale', express.static(path.join(__dirname, 'locale')));
app.use('/css/', express.static(path.join(__dirname, 'public/css')));
app.use('/js/', express.static(path.join(__dirname, 'public/js')));
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
