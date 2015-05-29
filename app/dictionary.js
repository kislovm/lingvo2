var models = require('../app/models');
var langs = {
    chinese: require('../chinese'),
    arabic: require('../arabic'),
    portugal: require('../portugal'),
    russian: require('../russian'),
    spanish: require('../spanish'),
    turkish: require('../turkish')
};

module.exports = function(difficulty, language) {
    if (!this.dictionary)
        this.dictionary = {
            chinese: {},
            arabic: {},
            portugal: {},
            russian: {},
            spanish: {},
            turkish: {}
        };

    if (!this.dictionary[language][difficulty])
        this.dictionary[language][difficulty] = langs[language][difficulty].map(function (word) {
            return { original: word.original, translation: word.chinese };
        });

    return this.dictionary[language][difficulty];
};
