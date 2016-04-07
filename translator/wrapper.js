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
                    phrase: word,
                    translations: translation.text.map(function (word) {
                        return { text: word }
                    })
                });
            });
        });
    };

    this.setToCache = function(translation) {
        if(translation.translations && translation.translations.length) {
            translation.lang = this.language;
            translation.translations = JSON.stringify(translation.translations);
            return new TranslationCache(translation).save();
        }
    };

    this.getFromCache = function(word, lang) {
        return TranslationCache.findOne({ phrase: word, lang: lang }).exec()
            .then(function(translation) {
                if(translation) {
                    translation = translation.toJSON();
                    translation.translations = JSON.parse(translation.translations);
                }

                return translation;
            });
    };

    this.getFromCacheStemmed = function(word, lang) {
        return this.getFromCache(this.stemWord(word), lang);
    };

    this.getFromExternal = function(word, lang) {
        return translator.translate('en', lang, word)
            .then(this.getFromExternalCallback.bind(this));
    };

    this.getFromExternalCallback = function(translation) {
        if (translation.translations.length > 0) {
            this.setToCache(translation);
            return translation;
        } else {
            return null;
        }
    };

    this.getFromExternalStemmed = function(word, lang) {
        return this.getFromExternal(this.stemWord(word), lang);
    };

    this.getFromYandex = function(word, lang) {
        return this.yaTranslate(word, lang);
    };

    this.tryTranslate = function (methods, word, lang, transcription) {
        var method = methods.shift();

        return new Promise(function(resolve, reject) {
            method.call(this, word, lang)
                .then(function(translation) {
                    if(translation) {
                        if(!translation.transcription) {
                            translation.transcription = transcription;
                        }
                        resolve(translation);
                    } else {
                        resolve(this.tryTranslate(methods, word, lang, transcription));
                    }
                }.bind(this));
        }.bind(this));
    };

    this.getNoTranslation = function(word, lang) {
        return new Promise(function(resolve, reject) {
            resolve({
                phrase: word,
                translations: [{ text: 'No translation' }]
            })
        });
    };

    this.translate = function(word) {
        var transcription = translator.getTranscription(word);
        var methods = [
            this.getFromCache,
            this.getFromCacheStemmed,
            this.getFromExternal,
            this.getFromExternalStemmed,
            this.getFromYandex,
            this.getNoTranslation
        ];

        return this.tryTranslate(methods, word, this.language, transcription);
    };

    this.translate3 = function(word) {
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
                                                .then(this.getFromYandex.bind(this, word, lang));
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