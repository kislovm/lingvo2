var models = require('../app/models'),
    Natural = require('natural'),
    sanitizeHtml = require('sanitize-html'),
    parser = require('../parser/parser');

module.exports = {
    index: function(req, res) {
        this.category(req, res);
    },
    category: function(req, res) {
        var skip = 10 * (req.params.page || 0),
            difficulty = req.session.difficulty || 'general',
            query = {
                lexica: difficulty
            };

        req.params.category && req.params.category != 'all' &&
            (query.category = req.params.category);

        if(req.session.random && req.session.customDictionary) {
            var customDictionary = parser._preprocessDict(req.session.customDictionary);

            delete query.lexica;
            query.tokens = { $in: customDictionary };
        }

        models.Episode
            .find(query)
            .select('title link name publicationDate image processedDescription body originalArticleLink')
            .sort('-publicationDate')
            .skip(skip)
            .limit(10)
            .exec(function(err, episodes) {
                if (err) {
                    res.json({error: 'Episodes not found.'});
                } else {
                    if(customDictionary && !episodes.length) {
                        res.json([{ description: 'No articles found' }]);
                        return;
                    }

                    res.json(episodes.map(function(episode) {
                        if (customDictionary) {
                            episode.description = parser.highlight(episode.description, customDictionary);
                            episode.body && episode.processedBody && (episode.body = parser.highlight(episode.body, customDictionary));

                            return episode;
                        }

                        episode.description = episode.processedDescription[difficulty];
                        episode.body && episode.processedBody && (episode.body = episode.processedBody[difficulty]);

                        return episode;
                    }));

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
