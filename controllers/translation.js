var TranslationWrapper = require('../translator/wrapper.js');

module.exports = {
    translate: function(req, res) {
        var translationWrapper = new TranslationWrapper(req.session.language || 'chinese');
        var word = req.params.word.toLowerCase();

        translationWrapper.translate(word)
            .then(function(translation) {
                res.json(translation);
            }, function(error) {
                res.json(error);
            });
    }
};