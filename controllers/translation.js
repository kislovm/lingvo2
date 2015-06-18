var Translator = require('../translator/translator');
var Natural = require('natural');

module.exports = {
    translate: function(req, res) {
        var translator = new Translator();
        var langs = translator.languages();
        var word = req.params.word;

        translator.translate('en', langs[req.session.language || 'chinese'].shortcut, word)
            .then(function(translation) {
                if (translation.translations.length == 0) {
                    return translator.translate('en', langs[req.session.language || 'chinese'].shortcut, Natural.PorterStemmer.stem(word));
                } else {
                    res.json(translation);
                    done();
                }
            }, function() {
                return translator.translate('en', langs[req.session.language || 'chinese'].shortcut, Natural.PorterStemmer.stem(word));
            })
            .then(function(translation) {
                res.json(translation);
                done();
            }, function() {
                res.json({ transcription: 'Word not found' });
            });
    }
};