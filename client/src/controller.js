var Marionette = require('backbone.marionette'),
    AppLayoutView = require('./views/layouts/app-layout'),
    EpisodesView = require('./views/episodes'),
    DifficultyView = require('./views/difficulty'),
    EpisodesCollection = require('./collections/episodes');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        window.App.layoutView = new AppLayoutView();
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
        this.renderView(view);
        window.App.router.navigate('category/' + category);
    },

    difficulty: function() {
        if(!App.data.user) {
            window.App.router.navigate('/', { trigger: true });
            return;
        }
        App.core.vent.trigger('app:log', 'Controller: "Difficulty" route hit.');
        var el = $('<div class="popup">'),
            view = new DifficultyView({ model: window.App.data.user, el: el[0] });
        $('body').append(el);
        view.render();
    },

    renderView: function(view) {
        this.destroyCurrentView(view);
        App.core.vent.trigger('app:log', 'Controller: Rendering new view.');
        $('#js-boilerplate-app').html(view.render().el);
    },

    destroyCurrentView: function(view) {
        if (!_.isUndefined(window.App.views.currentView)) {
            App.core.vent.trigger('app:log', 'Controller: Destroying existing view.');
            window.App.views.currentView.close();
        }
        window.App.views.currentView = view;
    }
});
