var models = require('../app/models'),
    Natural = require('natural'),
    sanitizeHtml = require('sanitize-html');

module.exports = {
    index: function(req, res) {

        models.Episode.find({}).limit(20).sort('-publicationDate').exec(function(err, episodes) {
            res.json(episodes);
        });

    },
    category: function(req, res) {
        console.log(req.params.category);
        models.Episode.find({ category: req.params.category }).sort('-publicationDate').limit(10).exec(function(err, episodes) {
            if (err) {
                res.json({error: 'Episodes not found.'});
            } else {
                episodes.forEach(function(episode) {
                    var date = episode.publicationDate;
                    data && (episode.publicationDate = [date.getDate(), date.getMonth(), date.getFullYear()].join('.'));
                });
                res.json(episodes);
            }
        });
    },
    count: function(req, res) {
        var tokenizer = new Natural.WordTokenizer(),
            tokens = {},
            array = [];

        models.Episode.find({}).exec(function(err, episodes) {

            episodes.forEach(function(episode){
                tokenizer.tokenize(sanitizeHtml(episode.description)).map(function(token) {
                    if(token && token.length > 4 &&
                        ['border', 'height', 'width', 'padding', 'style', 'margin'].indexOf(token) === -1) {
                        tokens[token] = (tokens[token] ? tokens[token] + 1 : 1);
                    }
                });
            });

            for (var key in tokens) {
                if (tokens.hasOwnProperty(key)) {
                    array.push({
                        word: key,
                        count: tokens[key]
                    });
                }
            }

            array.sort(function(a,b){
                if(a.count < b.count) return 1;
                if(a.count > b.count) return -1;
                return 0;
            });
            res.json(array);
        });
    }
};
