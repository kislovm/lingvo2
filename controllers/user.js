var models = require('../app/models');
var dictionary = require('../app/dictionary.js');

module.exports = {
    setLang: function(req, res) {
        req.session.language = req.body.language;
        if (req.user) {
            req.user.language = req.session.language;
            req.user.save();
        }

        res.json({
            success: true
        });
    },

    set: function(req, res) {
        var difficulties = {
            'General': 'general',
            'Business English': 'business',
            'For TOEFL': 'toefl',
            'For GMAT': 'gmat',
            'For GRE': 'gre',
            'Irregular verbs': 'irregular'
        };

        req.session.language = req.body.language;
        req.session.source = req.body.source;
        req.session.autosave = req.body.autosave;
        req.session.hideHint = req.body.hideHint;
        
        if (req.user) {
            req.user.language = req.session.language;
            req.user.save();
        }

        res.json({
            registred: !!req.user,
            autosave: req.session.autosave,
            language: (req.user ? req.user.language : req.session.language) || 'chinese',
            source: req.session.source || []
        });
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

        res.json({
            registred: !!req.user,
            autosave: req.session.autosave,
            language: (req.user ? req.user.language : req.session.language) || 'chinese',
            source: req.session.source || [],
            hideHint: req.session.hideHint
        });

    }
};
