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
            var counter = 0;
            console.log(1);
            episodes.forEach(function(episode) {
                console.log(++counter);
                //arr.forEach(function(title) {
                //
                //    if(natural.LevenshteinDistance(episode.title, title) < 2) {
                //        console.log(episode.title, title);
                //        episode.remove()
                //    }
                //});
                //
                //arr.push(episode.title);


                if (episode.description.indexOf('...') === episode.description.length - 3) {
                    episode.description = episode.description.slice(0, -3);
                    episode.save();
                }
            });
            console.log('');
            console.log('-------------');
            console.log('ALL DONE');
        });

    return 0;

});
