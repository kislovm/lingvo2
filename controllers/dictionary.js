var dictionary = require('../app/dictionary.js');

module.exports = {

    get: function(req, res) {
        if (req.session.customDictionary) {
            res.json(req.session.customDictionary);
        } else {
            res.json(dictionary(req.session.difficulty || 'general', req.session.language || 'chinese'));
        }

    }
};
