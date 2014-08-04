var Marionette = require('backbone.marionette'),
    EpisodesView = require('./views/episodes'),
    EpisodesCollection = require('./collections/episodes'),
    ContactDetailsView = require('./views/contact_details'),
    AddContactView = require('./views/add');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        window.App.views.episodesView = new EpisodesView({ collection: window.App.data.episodes });
    },

    home: function() {
        App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');
        var view = window.App.views.episodesView;
        this.renderView(view);
        window.App.router.navigate('#');
    },

    category: function(category) {
        App.core.vent.trigger('app:log', 'Controller: "Category" route hit.');
        var view = new EpisodesView({ collection: new EpisodesCollection({ category: category }) });
        view.collection.fetch();
        this.renderView(view);
        window.App.router.navigate('category/' + category);
    },

    add: function() {
        App.core.vent.trigger('app:log', 'Controller: "Add Contact" route hit.');
        var view = new AddContactView();
        this.renderView(view);
        window.App.router.navigate('add');
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
