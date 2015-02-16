var models = require('../app/models');

module.exports = {
    set: function(req, res) {
        var difficulties = {
            'General': 'general',
            'Business English': 'business',
            'For TOEFL': 'toefl',
            'For GMAT': 'gmat',
            'For GRE': 'gre',
            'Irregular verbs': 'irregular'
        };

        req.session.difficulty = difficulties[req.body.difficulty];

        res.json({ success: true });

    },

    get: function(req, res) {

        res.json({ difficulty: req.session.difficulty });

    }
};
