var home = require('../controllers/home'),
    stat = require('../controllers/stat'),
    episodes = require('../controllers/episodes'),
    user = require('../controllers/user'),
    dictionary = require('../controllers/dictionary'),
    translation = require('../controllers/translation');

var UserModel = require('./models').User;
var DictionaryModel = require('./models').Dictionary;

var account = require('../controllers/account');

var passport = require('passport');

module.exports.initialize = function(app) {
    app.get('/', addUser, home.index);
    app.get('/stat', stat.index);

    app.get('/api/episodes/all/all/:page?', episodes.index);
    app.get('/api/episodes/:category/:page?', episodes.category);

    app.get('/count', episodes.count);

    app.post('/user', user.set);
    app.get('/user', user.get);

    app.get('/account', ensureAuthenticated, addUser, account.index);
    app.get('/account/edit', ensureAuthenticated, addUser, account.edit);
    app.get('/dictionary/add', ensureAuthenticated, addUser, account.add);
    app.get('/dictionary/list', ensureAuthenticated, addUser, account.listDictionary);
    app.post('/dictionary/list', ensureAuthenticated, addUser, account.setDictionary);
    app.post('/dictionary/add/word', ensureAuthenticated, addUser, account.addWord);
    app.get('/dictionary/edit/:name', ensureAuthenticated, addUser, account.editDictonary);
    app.get('/dictionary/delete/:name', ensureAuthenticated, addUser, account.deleteDictonary);

    app.get('/translate/:word', translation.translate);

    app.get('/word/:id/delete', ensureAuthenticated, addUser, account.deleteWord);

    app.get('/dictionary', dictionary.get);

    app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res){ });
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),
        function(req, res) { res.redirect('/#'); });
    app.get('/auth/twitter', passport.authenticate('twitter'), function(req, res){ });
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { failureRedirect: '/' }),
        function(req, res) { res.redirect('/#'); });
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
};

function addUser(req, res, next) {
    var user;

    UserModel.findById(req.session.passport.user).populate('selected').exec()
        .then(function (u) {
            if (u.selected) {
                req.user = u;
                next();
            } else {
                return UserModel.findById(req.session.passport.user).exec();
            }
        },
        function() {
            return UserModel.findById(req.session.passport.user).exec();
        })
        .then(function(u) {
            user = u;

            return DictionaryModel.findOne({ user: user._id }).exec();
        })
        .then(function(dictionary) {
            user.selected = dictionary;

            return user.save();
        })
        .then(addUser.bind(req, res, next))
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}