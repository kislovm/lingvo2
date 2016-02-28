var Dictionary = require('../app/models').Dictionary;
var TranslationWrapper = require('../translator/wrapper.js');

module.exports = {

    get: function(req, res) {
        var languageName = req.session.language || 'chinese';
        var translationWrapper = new TranslationWrapper(languageName);

        Dictionary.findOne({ user: req.user._id })
            .populate('words')
            .then(function(dictionary) {
                return Promise.all(dictionary.words.map(function(word) {
                    return translationWrapper.translate(word.text);
                }));
            })
            .then(function(words) {
                res.json(words.map(function(word, i) {
                    word.id = i;
                    return word;
                }));
            });
    },

    delete: function(req, res) {
        Dictionary.findOne({ user: req.user._id })
            .populate('words')
            .then(function(dictionary) {
                var wordsToDelete = dictionary.words.filter(function(word) {
                    return req.body.words.indexOf(word.text) !== -1;
                });

                return Promise.all(wordsToDelete.map(function(word) {
                    return word.remove();
                }));
            })
            .then(function() {
                res.json({ success: true });
            });
    }
};
