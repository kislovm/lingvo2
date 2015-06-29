var Translator = require('../translator/translator');
var Natural = require('natural');
var key = 'trnsl.1.1.20150621T174734Z.8833da3da29b93e8.3948cd85eb9a3d6fd682e6ecd814532552973e2d';
var yaTranslate = require('yandex-translate')(key);

module.exports = {
    translate: function(req, res) {
        var translator = new Translator();
        var langs = translator.languages();
        var word = req.params.word.toLowerCase();
        var lang = langs[(req.session.language) || 'chinese'].shortcut;
        var transcription = translator.getTranscription(word);

        translator.translate('en', lang, word)
            .then(function(translation) {
                if (translation.translations.length == 0) {
                    return translator.translate('en', lang, Natural.PorterStemmer.stem(word));
                } else {
                    res.json(translation);
                }
            })
            .then(function(translation) {
                if (translation.translations.length == 0) {
                    if (!transcription && translation.transcription) transcription = translation.transcription;
                } else {
                    res.json(translation);
                    done();
                }
            })
            .then(function() {
                yaTranslate.translate(word, { from: 'en', to: lang, key: key}, function(err, translation) {
                    res.json({
                        translations: translation.text.map(function(word) {
                            return { text: word }
                        }),
                        transcription: 'No transcription'
                    });
                });
            });
    }
};