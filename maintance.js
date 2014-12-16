var mongoose = require('mongoose'),
    seeder = require('./app/seeder'),
    difficulty = require('./app/difficulty');


mongoose.connect('mongodb://localhost/MyApp');
mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");

    var id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20);

    // check if the db is empty, if so seed it with some contacts:
    seeder.check();
    difficulty.set(id);
    setInterval(function() { try { seeder.check() } catch(e) {} }, '50000');
    setInterval(function() { try { difficulty.set(id) } catch(e) {} }, '100000');
});
