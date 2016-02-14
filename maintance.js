var mongoose = require('mongoose');
var seeder = require('./app/seeder');
var difficulty = require('./app/difficulty');


mongoose.connect('mongodb://localhost/MyApp');
mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");

    var id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20);

    function doStuff() {
        difficulty
            .find(id)
            .then(function(episodes) {
                var count = episodes && episodes.length;

                if(count) {
                    return difficulty.processMany(episodes, id);
                } else {
                    setTimeout(doStuff, 5000);
                    return Promise.reject();
                }
            })
            .then(doStuff, function(error) { console.log('Error:' + error)});
    }

    doStuff();

    try { seeder.check(); } catch (e) { }
    setInterval(function() { try { seeder.check(); } catch(e) {} }, '300000');
});
