var models = require('../app/models'),
    chinese = require('../chinese');

module.exports = {

    get: function(req, res) {
        var difficulty = req.session.difficulty || 'general';

        if(!this.dictionary)
            this.dictionary = {};

        if(!this.dictionary[difficulty])
            this.dictionary[difficulty] = chinese[difficulty].map(function(word) {
                return { original: word.original, translation: word.chinese }
            });

        res.json({
            dictionary: this.dictionary[difficulty]
        });

    }
};
