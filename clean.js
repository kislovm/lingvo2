var models = require('./app/models'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/MyApp');

mongoose.connection.on('open', function() {

    var arr = [];

    models.Episode.find({}, function(err, episodes) {
	episodes.forEach(function(episode) {
            if(episode.name == 'Economist') { console.log(episode); };
            arr.push(episode.title.slice(20));
        });
    });

});
