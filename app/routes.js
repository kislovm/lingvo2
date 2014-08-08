var home = require('../controllers/home'),
    contacts = require('../controllers/contacts'),
    episodes = require('../controllers/episodes');
    user = require('../controllers/user');

module.exports.initialize = function(app) {
    app.get('/', home.index);
    app.get('/api/episodes', episodes.index);
    app.get('/api/episodes/:category', episodes.category);
    app.post('/user', user.set);
    app.get('/user', user.get);
};
