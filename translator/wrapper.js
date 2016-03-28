var Natural = require('natural');
var key = 'trnsl.1.1.20150621T174734Z.8833da3da29b93e8.3948cd85eb9a3d6fd682e6ecd814532552973e2d';
var yaTranslate = require('yandex-translate')(key);
var Translator = require('../translator/translator');
var TranslationCache = require('../app/models').Translation;

module.exports = function (languageName) {
    var translator = new Translator();

    this.language = translator.getLanguageShortcut(languageName);

    this.stemWord = function(word) {
        return Natural.PorterStemmer.stem(word);
    };

    this.yaTranslate = function(word, lang) {
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

    this.getFromCache = function(word, lang) {
        return TranslationCache.findOne({ phrase: word, lang: lang }).exec();
    };

    this.setToCache = function(translation, lang) {
        translation.lang = lang;
        translation.translations = translation.translations;
        return new TranslationCache(translation).save();
    };

    this.getFromExternal = function(word, lang) {
        return translator.translate('en', lang, word);
    };

    this.translate = function(word) {
        var lang = this.language;

        return this.getFromCache(word, lang)
            .then(function(translation) {
                if(translation) {
                    return translation;
                } else {
                    return this.getFromCache(this.stemWord(word), lang)
                        .then(function(translation) {
                            if(translation) {
                                return translation;
                            } else {
                                return this.getFromExternal(word, lang)
                                    .then(function(translation) {
                                        if(translation) {
                                            this.setToCache(translation, lang);
                                            return translation;
                                        } else {
                                            return this.getFromExternal(this.stemWord(word), lang)
                                                .then(function(translation) {
                                                    if(translation) {
                                                        this.setToCache(translation, lang);
                                                        return translation;
                                                    } else {
                                                        return this.yaTranslate(word, lang);
                                                    }
                                                }.bind(this));
                                        }
                                    }.bind(this));
                            }
                        }.bind(this));
                }
            }.bind(this));
    };

    this.translate2 = function(word) {
        var lang = this.language;
        var transcription = translator.getTranscription(word);
        var yaTranslate = this.yaTranslate.bind(this, word, lang);
        return translator.translate('en', lang, word)
            .then(function(translation) {
                if (translation.translations.length > 0) {
                    return translation;
                } else {
                    return translator.translate('en', lang, Natural.PorterStemmer.stem(translation.phrase))
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
                    translations: translation.translations.slice(0,5),
                    transcription: transcription
                }
            });
    }
};