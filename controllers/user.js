var models = require('../app/models');
var dictionary = require('../app/dictionary.js');

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
        req.session.language = req.body.language;
        req.session.source = req.body.source;
        req.session.highlightDict = req.body.highlightDict;
        req.session.autosave = req.body.autosave;
        
        if (req.user) {
            req.user.language = req.session.language;
            req.user.save();
        }

        res.json({
            registred: !!req.user,
            autosave: req.session.autosave,
            difficulty: difficulties[req.session.difficulty],
            language: (req.user ? req.user.language : req.session.language) || 'chinese',
            source: req.session.source || [],
            highlightDict: !!req.session.highlightDict
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
            difficulty: difficulties[req.session.difficulty],
            language: (req.user ? req.user.language : req.session.language) || 'chinese',
            source: req.session.source || [],
            highlightDict: !!req.session.highlightDict
        });

    }
};
