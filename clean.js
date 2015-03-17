var models = require('./app/models');
var mongoose = require('mongoose');
var natural = require('natural');


mongoose.connect('mongodb://localhost/MyApp');

mongoose.connection.on('open', function() {

    var arr = [];

    models.Episode
        .find({})
        //.sort('-publicationDate')
        .select('description')
        .exec()
        .then(function(episodes) {
            var counter = 0,
                trimmed = 0;
            episodes.forEach(function(episode) {
                ++counter;
                //arr.forEach(function(title) {
                //
                //    if(natural.LevenshteinDistance(episode.title, title) < 2) {
                //        console.log(episode.title, title);
                //        episode.remove()
                //    }
                //});
                //
                //arr.push(episode.title);
                
                if (episode.description.indexOf('...') === (episode.description.length - 4)) {
                    episode.description = episode.description.slice(0, -3);
                    episode.save();
                    trimmed++;
                    console.log(episode.description);
                }
            });
            console.log('');
            console.log('-------------');
            console.log('Processed: ' + counter);
            console.log('-------------');
            console.log('Trimmed: ' + trimmed);
            console.log('-------------');
            console.log('ALL DONE');
        });

    return 0;

});
