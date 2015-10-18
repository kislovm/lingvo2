var $ = require('jquery'),
    Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    Controller = require('./controller'),
    Router = require('./router'),
    UserModel = require('./models/user'),
    MenuView = require('./views/menu'),
    AuthView = require('./views/auth'),
    DifficultyView = require('./views/difficulty'),
    EpisodesCollection = require('./collections/episodes');

var dictModel = require('./models/dictionary-popup-model');

module.exports = App = function App() {};

App.prototype.start = function() {
    App.core = new Marionette.Application();

    App.core.on("before:start", function() {
        App.core.vent.trigger('app:log', 'App: Initializing');

        App.views = {};
        App.data = {};

        // load up some initial data:
        var episodes = new EpisodesCollection();
        episodes.fetch({
            success: function() {
                App.data.episodes = episodes;
                App.core.vent.trigger('app:start');
            }
        });

        App.data.dictModel = new dictModel();
        App.data.dictModel.fetch();

    });

    App.core.vent.bind('app:start', function() {
        App.core.vent.trigger('app:log', 'App: Starting');
        if (Backbone.history) {
            App.controller = new Controller();
            App.router = new Router({ controller: App.controller });
            new AuthView().render();

            App.core.vent.trigger('app:log', 'App: Backbone.history starting');
        }

        var user = new UserModel();
        user.fetch({
            success: function() {
                App.data.user = user;
                App.core.vent.trigger('user:init');
            }
        });

        //new up and views and render for base app here...
        App.core.vent.trigger('app:log', 'App: Done starting and running!');
    });

    App.core.vent.bind('user:init', function(options) {
        App.core.vent.trigger('app:log', 'User: Initializing');
        Backbone.history.start();
    });

    App.core.vent.bind('app:log', function(msg) {
        console.log(msg);
    });

    App.core.start();
};
