var Natural = require('natural'),
    sanitizeHtml = require('sanitize-html');


Natural.PorterStemmer.attach();

module.exports = {

    defaultClassificator: function(hits, count) {
        return hits / count > 0.3;
    },

    _dicts: {},

    _preprocessDicts: function(dicts) {
        dicts.forEach(function(dict) {
            if(this._dicts[dict.name]) return;

            this._dicts[dict.name] = dict.words.map(function(word) {
                if (word.original) return word.original.stem();
                return word.stem();
            });

        }, this);
    },

    _preprocessDict: function(dict) {
        return dict.map(function(word) {
            if (word.original) return word.original.stem();
            return word.stem();
        });
    },

    _tokenize: function(text) {
        return this._tokenizer.tokenize(sanitizeHtml(text), { allowedTags: [] });
    },

    highlight: function(text, truncatedWords) {
        return text.split(' ').map(function(word) {
            if (truncatedWords.indexOf(word.stem().match(/\w+/) && word.stem().match(/\w+/)[0]) != -1)
                return '<span class="highlight">' + word + '</span>'; else
                return word;
        }).join(' ');
    },

    _tokenizer: new Natural.WordTokenizer(),

    parse: function(dicts, episode) {
        this._preprocessDicts(dicts);

        var processedDescription = {},
            processedBody = {},
            descriptionTokens = this._tokenize(episode.description),
            bodyTokens = episode.body ? this._tokenize(episode.body) : [],
            tokens = descriptionTokens.concat(bodyTokens),
            matches = [];

        dicts.forEach(function(dict) {

            var count = 0,
                classificator = dict.classificator || this.defaultClassificator,
                hits = 0,
                used = [],
                truncatedWords = this._dicts[dict.name];

            tokens.forEach(function(token) {

                var truncatedToken = token.stem();

                if (used.indexOf(truncatedToken) == -1) {
                    count++;
                    if (truncatedWords.indexOf(truncatedToken.match(/\w+/) && truncatedToken.match(/\w+/)[0]) != -1) {
                        hits++;
                    }
                    used.push(truncatedToken.match(/\w+/)[0]);
                }

                if (classificator(hits, count) && episode.lexica.indexOf(dict.name) == -1) {
                    (episode.lexica && episode.lexica instanceof
                    Array ? episode.lexica.push(dict.name) : episode.category = [dict.name]);

                }

            });

            processedDescription[dict.name] = this.highlight(episode.description, truncatedWords);
            processedBody[dict.name] = episode.body && this.highlight(episode.body, truncatedWords);
            matches = matches.concat(used);

        }, this);

        return {
            processedDescription: processedDescription,
            processedBody: processedBody,
            tokens: matches
        };

    }

};
