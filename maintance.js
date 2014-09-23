var mongoose = require('mongoose'),
    seeder = require('./app/seeder'),
    difficulty = require('./app/difficulty');


mongoose.connect('mongodb://localhost/MyApp');
mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");

    // check if the db is empty, if so seed it with some contacts:
    seeder.check();
    difficulty.set();
    setInterval(function() { try { seeder.check() } catch(e) {} }, '50000');
    setInterval(function() { try { difficulty.set() } catch(e) {} }, '100000');
});
