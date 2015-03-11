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
            var counter = 0;
            episodes.forEach(function(episode) {
                if(episode.title.indexOf('Viewfinder:') != -1) console.log(episode);
                console.log(++counter);
                arr.forEach(function(title) {

                    if(natural.LevenshteinDistance(episode.title, title) < 2) {
                        console.log(episode.title, title);
                        episode.remove()
                    }
                });

                arr.push(episode.title);
            });
            console.log('');
            console.log('-------------');
            console.log('ALL DONE');
        });

    return 0;

});
