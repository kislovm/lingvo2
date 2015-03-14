var Marionette = require('backbone.marionette'),
    Controller = require('./controller'),
    Router = require('./router'),
    UserModel = require('./models/user'),
    MenuView = require('./views/menu'),
    DifficultyView = require('./views/difficulty'),
    EpisodesCollection = require('./collections/episodes');

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

    });

    App.core.vent.bind('app:start', function() {
        App.core.vent.trigger('app:log', 'App: Starting');
        if (Backbone.history) {
            App.controller = new Controller();
            App.router = new Router({ controller: App.controller });
            App.layoutView.menu.show(new MenuView());

            //Макаевский говнокод -- поправить.
            var eTopTopics = $('.j-topics').offset().top, eTopLanguageLVL = $('.j-languageLVL').offset().top;
            $(window).scroll(function() {
                if (eTopTopics - $(window).scrollTop() <= 75) {
                    $('.j-topics').css({'position': 'fixed', 'top': '75px'});
                } else {
                    $('.j-topics').css({'position': '', 'top': ''});
                }

                if (eTopLanguageLVL - $(window).scrollTop() <= 0) {
                    $('.j-languageLVL, .articles').addClass('floating');
                } else {
                    $('.j-languageLVL, .articles').removeClass('floating');
                }
            });
            $('.j-show-about')
                .hover(function() {
                    $('.how').removeClass('hide').delay(1).queue(function(){
                        $(this).addClass("showing").dequeue();
                    });
                },
                function() {
                    $('.how').removeClass('showing').delay(150).queue(function(){
                        $(this).addClass('hide').dequeue();
                    });
                })
                .click(function() {
                    $('.mobile-how').toggleClass('hide');
                });


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
        App.layoutView.difficulty.show(new DifficultyView({ model: App.data.user }));
        App.data.dictionary = {};

        App.data.user.on('sync', function() {
            if(App.data.xhr) App.data.xhr.abort();
            App.data.xhr = $.get('/dictionary', function(data) {
                App.data.dictionary[App.data.user.get('difficulty')] = data.dictionary;
                App.data.user.set('dictionary', data.dictionary);
            }, 'json');
        });

        Backbone.history.start();
    });

    App.core.vent.bind('app:log', function(msg) {
        console.log(msg);
    });

    App.core.start();
};
