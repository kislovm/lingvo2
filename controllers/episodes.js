var models = require('../app/models'),
    Natural = require('natural'),
    sanitizeHtml = require('sanitize-html'),
    parser = require('../parser/parser');

module.exports = {
    index: function(req, res) {
        var skip = 10 * (req.params.page || 0),
            difficulty = req.session.difficulty || 'general';

        models.Episode.find({ lexica: difficulty })
            .skip(skip)
            .limit(10)
            .sort('-publicationDate').exec(function(err, episodes) {
                res.json(episodes.map(function(episode) {
                    episode.description = episode.processedDescription[difficulty];
                    episode.body && episode.processedBody && (episode.body = episode.processedBody[difficulty]);

                    return episode;
                }));
        });

    },
    category: function(req, res) {
        var skip = 10 * (req.params.page || 0),
            difficulty = req.session.difficulty || 'general',
            query = {
                lexica: difficulty
            };

        req.params.category != 'all' &&
            (query.category = req.params.category);

        //if(req.session.random && req.session.customDictionary) {
        //    var arr = [];
        //
        //    models.Episode.find({ category: req.params.category }).exec(function(err, episodes) {
        //        for(var i=0; i<episodes.length; i++) {
        //            var episode = episodes[i];
        //
        //            var result = parser([{
        //                name: 'custom',
        //                words: req.session.customDictionary,
        //                classificator: function(hits) { return !!hits; }
        //            }], episode);
        //
        //            episode.description = result.processedDescription['custom'];
        //            episode.body = result.processedBody['custom'];
        //
        //            result.ok && arr.push(episode);
        //
        //            if(arr.length > 30) continue;
        //        }
        //
        //        res.json(arr);
        //
        //    });
        //
        //    return;
        //}

        models.Episode
            .find()
            .sort('-publicationDate')
            .skip(skip)
            .limit(10)
            .exec(function(err, episodes) {
                if (err) {
                    res.json({error: 'Episodes not found.'});
                } else {
                    res.json(episodes.map(function(episode) {
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
