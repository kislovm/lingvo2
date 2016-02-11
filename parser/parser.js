var Natural = require('natural');
var sanitizeHtml = require('sanitize-html');


Natural.PorterStemmer.attach();

module.exports = {
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
        return text.split(/(\s|<br>|<\/br>)/g).map(function(token) {
            var words = token.match(/\w+('|.|,)?(\w+)?/g) || [];

            return words.map(function(word, index) {
                if (word == 'br' || word == 'br>') {
                    if(index === 0) {
                        return '';
                    } else {
                        return '</br>';
                    }
                }

                if (truncatedWords.indexOf(word.stem()) != -1) {
                    return '<span title="Перевод" class="word highlight">' + word + '</span>';
                } else {
                    return '<span title="Перевод" class="word">' + word + '</span>';
                }
            }).join(' ');
        }).join(' ');
    },

    _tokenizer: new Natural.WordTokenizer(),

    parse: function(dicts, episode) {
        this._preprocessDicts(dicts);

        var dict = dicts[0];

        var processedDescription;
        var processedBody;
        var truncatedWords = this._dicts[dict.name];
        var description = episode.body.slice(0,15);

        processedDescription = this.highlight(description, truncatedWords);
        processedBody = episode.body && this.highlight(episode.body, truncatedWords);

        return {
            processedDescription: processedDescription,
            processedBody: processedBody
        };

    }

};
