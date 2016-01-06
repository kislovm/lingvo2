var Dictionary = require('../app/models').Dictionary;
var Translator = require('../translator/translator');

module.exports = {

    get: function(req, res) {
        var translator = new Translator();

        Dictionary.findOne({ user: req.user._id })
            .populate('words')
            .then(function(dictionary) {
                return Promise.all(dictionary.words.map(function(word) {
                    return translator.translate('en', 'ru', word.text);
                }));
            })
            .then(function(words) {
                res.json(words.map(function(word, i) {
                    word.id = i;
                    return word;
                }));
            });
    }
};
