var models = require('../app/models');
var Natural = require('natural');
var sanitizeHtml = require('sanitize-html');
var parser = require('../parser/parser');

var Stat = require('../stat/controller');

module.exports = {
    index: function(req, res) {
        this.category(req, res);
    },

    category: function(req, res) {
        var skip = 10 * (req.params.page || 0),
            query = {};

        if (req.params.category && req.params.category !== 'all') {
            query.category = req.params.category;
        }

        if (req.session.source && req.session.source.length) {
            query.originalArticleLink = { $in: req.session.source };
        }

        models.Episode
            .find(query)
            .select('_id title link name publicationDate image processedDescription processedBody originalArticleLink')
            .sort('-publicationDate')
            .skip(skip)
            .limit(10)
            .exec(function(error, episodes) {
                if (error) {
                    res.json({ error: 'Episodes not found.' });
                } else {
                    res.json(episodes);
                }
        });
    },

    one: function(req, res) {
        models.Episode.findOne({ _id: req.params.id })
            .select('title link name publicationDate image processedDescription processedBody originalArticleLink')
            .exec()
            .then(
                function(episode) {
                    res.json(episode);
                }
        );
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
