var home = require('../controllers/home'),
    contacts = require('../controllers/contacts'),
    episodes = require('../controllers/episodes');

module.exports.initialize = function(app) {
    app.get('/', home.index);
    app.get('/api/episodes', episodes.index);
    app.get('/api/episodes/:category', episodes.category);
};
