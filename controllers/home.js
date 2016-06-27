var lang = require('./lang');

module.exports = {
    index: function(req, res) {
        if(req.user) {
            if (!req.user.name) {
                req.user.name = req.user.username;
            }
        }

        Object.keys(lang).forEach(function(key) {
            lang[key] = req.t(lang[key]);
        });

        res.render('index', { user: req.user, lang: lang });
    }
};
