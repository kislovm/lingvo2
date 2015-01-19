var models = require('../app/models'),
    Natural = require('natural'),
    sanitizeHtml = require('sanitize-html');

module.exports = {
    index: function(req, res) {
        var skip = 10 * (req.params.page || 0);
        models.Episode.find({ lexica: 'general' })
            .skip(skip)
            .limit(10)
            .sort('-publicationDate').exec(function(err, episodes) {
                res.json(episodes);
        });

    },
    category: function(req, res) {
        var skip = 10 * (req.params.page || 0);
        var query = {};
        if(req.params.category !== 'general') {
          query['lexica'] = req.params.category;
        }
        if(req.params.theme !== 'general') {
          query['category'] = req.params.theme;
        }

        models.Episode
            .find(query)
            .sort('-publicationDate')
            .skip(skip)
            .limit(10)
            .exec(function(err, episodes) {
                if (err) {
                    res.json({error: 'Episodes not found.'});
                } else {
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
                tokenizer.tokenize(sanitizeHtml(episode.description.toLowerCase(), { allowedTags: [] })).map(function(token) {
                    if(['border', 'height', 'width', 'padding', 'style', 'margin', 'href', 'nbsp', 'hellip', 's'].indexOf(token) === -1 &&
                        !+token) {
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
