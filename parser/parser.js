var Natural = require('natural'),
    sanitizeHtml = require('sanitize-html');

module.exports = parser = function(dicts, episode) {
    Natural.PorterStemmer.attach();

    var processedDescription = {},
        processedBody = {},
        tokenizer = new Natural.WordTokenizer(),
        tokens = tokenizer.tokenize(sanitizeHtml(episode.description, { allowedTags: [] })),
        defaultClassificator = function(hits,count) { return hits/count > 0.3; };

    episode.body && tokens.concat(tokenizer.tokenize(sanitizeHtml(episode.body, { allowedTags: [] })));

    dicts.forEach(function(dict) {
        var count = 0,
            classificator = dict.classificator ||
                defaultClassificator, hits = 0, used = [], truncatedWords = dict.words.map(function(word) {
                return word.stem();
            });

        tokens.forEach(function(token) {
            var truncatedToken = token.stem();

            if (used.indexOf(truncatedToken) == -1) {
                count++;
                if (truncatedWords.indexOf(truncatedToken) != -1) {
                    hits++;
                }
                used.push(truncatedToken);
            }

            if (classificator(hits, count) && episode.lexica.indexOf(dict.name) == -1)
                (episode.lexica &&
                episode.lexica instanceof
                Array ?
                    episode.lexica.push(dict.name) :
                    episode.category = [dict.name]);

        });

        processedDescription[dict.name] = episode.description.split(' ').map(function(word) {
            if (truncatedWords.indexOf(word.stem().match(/\w+/) && word.stem().match(/\w+/)[0]) != -1)
                return '<span class="highlight">' + word + '</span>'; else
                return word;
        }).join(' ');

        processedBody[dict.name] = episode.body && episode.body.split(' ').map(function(word) {
            if (truncatedWords.indexOf(word.stem().match(/\w+/) && word.stem().match(/\w+/)[0]) != -1)
                return '<span class="highlight">' + word + '</span>'; else
                return word;
        }).join(' ');

    });

    return {
        processedDescription: processedDescription,
        processedBody: processedBody
    };

};
