var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var Controller = require('./controller');
var Router = require('./router');

var DictModel = require('./models/dictionary-popup-model');
var UserModel = require('./models/user');

module.exports = App = function App() {};

App.prototype.start = function() {
    App.core = new Marionette.Application();

    App.core.on("before:start", function() {
        App.core.vent.trigger('app:log', 'App: Initializing');

        App.views = {};
        App.data = {};

        App.data.dict = new DictModel();
        App.data.user = new UserModel();

        App.data.user.fetch()
            .then(function() {
                App.core.vent.trigger('app:start');
            });

    });

    App.core.vent.bind('app:start', function() {
        App.core.vent.trigger('app:log', 'App: Starting');
        if (Backbone.history) {
            App.controller = new Controller();
            App.router = new Router({ controller: App.controller });

            App.core.vent.trigger('app:log', 'App: Backbone.history starting');
        }

        Backbone.history.start();

        //new up and views and render for base app here...
        App.core.vent.trigger('app:log', 'App: Done starting and running!');
    });

    App.core.vent.bind('app:log', function(msg) {
        console.log(msg);
    });

    App.core.start();
};
