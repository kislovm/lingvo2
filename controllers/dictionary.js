var models = require('../app/models'),
    langs = {
        chinese: require('../chinese'),
        arabic: require('../arabic'),
        portugal: require('../portugal'),
        russian: require('../russian'),
        spanish: require('../spanish'),
        turkish: require('../turkish')
    };

module.exports = {



    get: function(req, res) {
        var difficulty = req.session.difficulty || 'general';

        if(!this.dictionary)
            this.dictionary = {
                chinese: {},
                arabic: {},
                portugal: {},
                russian: {},
                spanish: {},
                turkish: {}
            };

        if(!this.dictionary[req.session.language || 'chinese'][difficulty])
            this.dictionary[req.session.language || 'chinese'][difficulty] = langs[req.session.language || 'chinese'][difficulty].map(function(word) {
                return { original: word.original, translation: word.chinese }
            });

        res.json({
            dictionary: this.dictionary[req.session.language || 'chinese'][difficulty]
        });

    }
};
