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
        var difficulties = {
            'general': 'General',
            'business': 'Business English',
            'toefl': 'For TOEFL',
            'gmat': 'For GMAT',
            'gre': 'For GRE',
            'irregular': 'Irregular verbs'
        };

        res.json({ difficulty: difficulties[req.session.difficulty] });

    }
};
