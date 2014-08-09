var Marionette = require('backbone.marionette'),
    Controller = require('./controller'),
    Router = require('./router'),
    UserModel = require('./models/user'),
    MenuView = require('./views/menu'),
    EpisodesCollection = require('./collections/episodes');

module.exports = App = function App() {};

App.prototype.start = function(){
    App.core = new Marionette.Application();

    App.core.on("initialize:before", function (options) {
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

    });

    App.core.vent.bind('app:start', function(options){
        App.core.vent.trigger('app:log', 'App: Starting');
        if (Backbone.history) {
            App.controller = new Controller();
            App.router = new Router({ controller: App.controller });
            App.layoutView.menu.show(new MenuView());
            App.core.vent.trigger('app:log', 'App: Backbone.history starting');
            Backbone.history.start();
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

        if(!App.data.user.get('difficulty')) App.router.navigate('difficulty', { trigger: true });

    });

    App.core.vent.bind('app:log', function(msg) {
        console.log(msg);
    });

    App.core.start();
};
