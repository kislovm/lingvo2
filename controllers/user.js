var models = require('../app/models');

module.exports = {
    set: function(req, res) {

        req.session.difficulty = req.body.difficulty;

        res.json({ success: true });

    },

    get: function(req, res) {

        res.json({ difficulty: req.session.difficulty });

    }
};
