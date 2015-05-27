var mongoose = require('mongoose'),
    seeder = require('./app/seeder'),
    difficulty = require('./app/difficulty');


mongoose.connect('mongodb://localhost/MyApp');
mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");

    var id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20);

    // check if the db is empty, if so seed it with some contacts:

    function doStuff() {
        difficulty
            .find(id)
            .then(function(episodes) {
                var count = episodes && episodes.length;

                if(count) {
                    difficulty.processMany(episodes, id);
                }
                return count
            })
            .then(function(result) {
                if (result) {
                    doStuff();
                } else {
                    setTimeout(doStuff, 5000);
                }
            });
    }

    doStuff();

    try { seeder.check(); } catch (e) { }
    setInterval(function() { try { seeder.check(); } catch(e) {} }, '300000');
});
