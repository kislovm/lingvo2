var models = require('./app/models');
var mongoose = require('mongoose');
var natural = require('natural');


mongoose.connect('mongodb://localhost/MyApp');

mongoose.connection.on('open', function() {

    var arr = [];

    models.Episode
        .find({})
        .select('title')
        .exec()
        .then(function(episodes) {
            episodes.forEach(function(episode) {
                arr.forEach(function(title) {
                    if(natural.LevenshteinDistance(episode.title, title) < 2)
                    console.log(episode.title, title);
                });

                arr.push(episode.title);
            });
            console.log('all done');
        });

    return 0;

});
