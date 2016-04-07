var Dictionary = require('../app/models').Dictionary;
var TranslationWrapper = require('../translator/wrapper.js');

module.exports = {

    get: function(req, res) {
        var languageName = req.session.language || 'chinese';
        var translationWrapper = new TranslationWrapper(languageName);

        Dictionary.findOne({ user: req.user._id })
            .populate('words')
            .then(function(dictionary) {
                return Promise.all(dictionary.words.map(function(word, i) {
                    return new Promise(function(resolve) {
                        translationWrapper.translate(word.text)
                            .then(function(translation) {
                                resolve({
                                    id: i,
                                    phrase: word.text,
                                    translations: translation.translations.slice(0,5),
                                    transcription: translation.transcription
                                })
                            });
                    });
                }));
            })
            .then(function(words) {
                res.json(words);
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
