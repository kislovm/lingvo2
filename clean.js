var models = require('./app/models'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/MyApp');

mongoose.connection.on('open', function() {

    var arr = [];

    models.Episode
        .find({})
        .select('title')
        .exec()
        .then(function(episodes) {
            episodes.forEach(function(episode) {
                if(episode.title in arr) console.log(episode.title);
                arr.push(episode.title);
            });
        });

    return 0;

});
