var Natural = require('natural');
var key = 'trnsl.1.1.20150621T174734Z.8833da3da29b93e8.3948cd85eb9a3d6fd682e6ecd814532552973e2d';
var yaTranslate = require('yandex-translate')(key);
var Translator = require('../translator/translator');

module.exports = function (languageName) {
    var translator = new Translator();

    this.language = translator.getLanguageShortcut(languageName);

    this.yaTranslate = function(lang, word) {
        return new Promise(function (resolve, reject){
            yaTranslate.translate(word, { from: 'en', to: lang, key: key }, function(error, translation) {
                resolve({
                    translations: translation.text.map(function (word) {
                        return {text: word}
                    })
                });
            });
        });
    };

    this.translate = function(word) {
        var lang = this.language;
        var transcription = translator.getTranscription(word);
        var yaTranslate = this.yaTranslate.bind(this, lang, word);
        return translator.translate('en', lang, word)
            .then(function(translation) {
                if (translation.translations.length > 0) {
                    return translation;
                } else {
                    return translator.translate('en', lang, Natural.PorterStemmer.stem(word))
                        .then(function(translation) {
                            if (translation.translations.length > 0) {
                                return translation;
                            } else {
                                if (!transcription && translation.transcription) {
                                    transcription = translation.transcription;
                                }
                                return yaTranslate(transcription);
                            }
                        });
                }
            })
            .then(function(translation) {
                return {
                    phrase: word,
                    translations: translation.translations,
                    transcription: transcription
                }
            });
    }
};