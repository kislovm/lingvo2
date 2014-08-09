var Marionette = require('backbone.marionette'),
    AppLayoutView = require('./views/layouts/app-layout'),
    EpisodesView = require('./views/episodes'),
    DifficultyView = require('./views/difficulty'),
    EpisodesCollection = require('./collections/episodes');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        App.layoutView = new AppLayoutView();
        App.popup = $('.popup-container');
    },

    home: function() {
        App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');

        if(!window.App.views.episodesView)
            window.App.views.episodesView = new EpisodesView({ collection: window.App.data.episodes });

        window.App.layoutView.content.show(window.App.views.episodesView);
        window.App.router.navigate('#');
    },

    category: function(category) {
        App.core.vent.trigger('app:log', 'Controller: "Category" route hit.');
        var view = new EpisodesView({ collection: new EpisodesCollection({ category: category }) });
        view.collection.fetch();
        window.App.layoutView.content.show(view);
        window.App.router.navigate('category/' + category);
    },

    difficulty: function() {
        if(!App.data.user) {
            window.App.router.navigate('/', { trigger: true });
            return;
        }
        App.core.vent.trigger('app:log', 'Controller: "Difficulty" route hit.');
        App.layoutView.popup.show(new DifficultyView({ model: window.App.data.user }));
        App.popup.addClass('showing');
    }

});
