var home = require('../controllers/home'),
    stat = require('../controllers/stat'),
    episodes = require('../controllers/episodes'),
    user = require('../controllers/user'),
    dictionary = require('../controllers/dictionary');

module.exports.initialize = function(app) {
    app.get('/', home.index);
    app.get('/stat', stat.index);
    app.get('/api/episodes/all/all/:page?', episodes.index);
    app.get('/api/episodes/:category/:page?', episodes.category);
    app.get('/count', episodes.count);
    app.post('/user', user.set);
    app.get('/user', user.get);
    app.get('/dictionary', dictionary.get);
};
