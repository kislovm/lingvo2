var models = require('../app/models');
var dictionary = require('../app/dictionary.js');
var shuffle = function (array){
    for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
    return array;
};

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

        delete req.session.customDictionary;
        req.session.difficulty = difficulties[req.body.difficulty];
        req.session.random = req.body.random;
        req.session.language = req.body.language;
        req.session.source = req.body.source;
        req.session.highlightDict = req.body.highlightDict;
        
        if (req.user) {
            req.user.language = req.session.language;
            req.user.save();
        }

        if (!!req.session.random)
            req.session.customDictionary = shuffle(dictionary(req.session.difficulty, req.session.language)).slice(-20);

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

        res.json({
            difficulty: difficulties[req.session.difficulty],
            random: req.session.random,
            language: (req.user ? req.user.language : req.session.language) || 'chinese',
            source: req.session.source,
            highlightDict: req.session.highlightDict
        });

    }
};
