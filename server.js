var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('Mongoose'),
    routes = require('./app/routes'),
    exphbs = require('express3-handlebars'),
    bodyParser = require('body-parser'),
    app = express();

app.set('port', process.env.PORT || 3301);
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: app.get('views') + '/layouts'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: 'apovu4b0g=8429IG4PB'}));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/client/images/', express.static(path.join(__dirname, '/client/images')));
app.use('/static/fonts/', express.static(path.join(__dirname, '/static/fonts')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//connect to the db server:
mongoose.connect('mongodb://localhost/MyApp');

//routes list:
routes.initialize(app);

//finally boot up the server:
http.createServer(app).listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});
