var models = require('../app/models'),
    chinese = require('../chinese');

module.exports = {
    get: function(req, res) {
        var difficulty = req.session.difficulty || 'general';

        res.json({
            dictionary: chinese[difficulty].map(function(word) {
                return { original: word.original, translation: word.chinese }
            })
        });

    }
};
