var Dictionary = require('../app/models').Dictionary;

module.exports = {

    get: function(req, res) {
        Dictionary.findOne({ user: req.user._id })
            .then(function(dictionary) {
                res.json(dictionary.words);
            });
    }
};
