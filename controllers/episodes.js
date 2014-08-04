var models = require('../app/models');

module.exports = {
    index: function(req, res) {

        models.Episode.find({}, function(err, data) {
            res.json(data);
        });

    },
    category: function(req, res) {
        console.log(req.params.category);
        models.Episode.find({ category: req.params.category }, function(err, episodes) {
            if (err) {
                res.json({error: 'Episodes not found.'});
            } else {
                res.json(episodes);
            }
        });
    }
};
