var models = require('./models');
var parser = require('../parser/parser');
var general = require('../dicts/general');


module.exports = {

    dicts: [
        general
    ],

    counter: 0,

    find: function(id) {
        return models.Episode.find({ 'processed': { $ne: id } }).sort({ _id: -1 }).limit(10).exec();
    },

    processMany: function(episodes, id) {
        return Promise.all(episodes.map(function(episode) {
            return this.process(episode, id);
        }, this));
    },

    process: function(episode, id) {
        var result = parser.parse([{ name: 'general', words: [], classificator: function() { return true } }], episode);

        this.counter++;

        var counter = this.counter;

        if(result) {
            episode.processedDescription = result.processedDescription;
            episode.processedBody = result.processedBody;
        } else {
            episode.processedDescription = '';
            episode.processedBody = '';
        }
        episode.processed = id;
        return episode.save()
            .then(function() {
                console.log('Saved episode: ' + counter)
            }.bind(this),
            function (error) {
                console.log('Failed to save episode: ' + this.counter + ' error: ' + error)
            }.bind(this));
    }

};
