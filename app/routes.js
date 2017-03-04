var home = require('../controllers/home');
var stat = require('../controllers/stat');
var episodes = require('../controllers/episodes');
var user = require('../controllers/user');
var auth = require('../controllers/auth');
var dictionary = require('../controllers/dictionary');
var translation = require('../controllers/translation');

var UserModel = require('./models').User;
var DictionaryModel = require('./models').Dictionary;
var WordModel = require('./models').Word;

var account = require('../controllers/account');

var passport = require('passport');

module.exports.initialize = function(app) {
    app.get('/news', home.index);
    app.get('/stat', stat.index);

    app.get('/api/episodes/all/all/:page?', addDictWords, episodes.index);
    app.get('/api/episodes/get/:id?', addDictWords, episodes.one);
    app.get('/api/episodes/:category/:page?', addDictWords, episodes.category);

    app.get('/count', episodes.count);

    app.post('/user', user.set);
    app.post('/user/lang', user.setLang);
    app.get('/user', user.get);

    app.get('/account', ensureAuthenticated, account.index);
    app.get('/account/edit', ensureAuthenticated, account.edit);

    app.get('/dictionary', ensureAuthenticated, dictionary.get);
    app.post('/dictionary/word/delete', ensureAuthenticated, dictionary.delete);
    app.get('/dictionary/add', ensureAuthenticated, account.add);
    app.get('/dictionary/list', ensureAuthenticated, account.listDictionary);
    app.post('/dictionary/list', ensureAuthenticated, account.setDictionary);
    app.post('/dictionary/add/word', ensureAuthenticated, account.addWord);
    app.get('/dictionary/edit/:name', ensureAuthenticated, account.editDictonary);
    app.get('/dictionary/delete/:name', ensureAuthenticated, account.deleteDictonary);

    app.get('/translate/:word', translation.translate);

    app.get('/word/:id/delete', ensureAuthenticated, account.deleteWord);

    app.get('/auth/forgot', auth.sendPassword);

    app.get('/auth/email', passport.authenticate('local'), function(req, res) {
        res.json({ success: true });
    });

    app.get('/auth/vk', passport.authenticate('vkontakte'), function(req, res){ });
    app.get(
        '/auth/vk/callback',
        passport.authenticate('vkontakte', { failureRedirect: '/' }),
        auth.redirect);
    app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res){ });
    app.get(
        '/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),
        auth.redirect);
    app.get('/auth/twitter', passport.authenticate('twitter'), function(req, res){ });
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { failureRedirect: '/' }),
        auth.redirect);
    app.get('/logout', auth.logout);
};

function addDictWords(req, res, next) {
    if (req.user) {
        WordModel.find({ dictionary: req.user.selected }).exec()
            .then(function(words) {
                req.session.selectedDictionaryWords = words.map(function (word) {
                    return word.text;
                });
                return next();
        });
    } else {
        return next();
    }

}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}
