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

        window.App.layoutView.content.show(new EpisodesView({ collection: window.App.data.episodes }));
        window.App.router.navigate('#');
    },

    category: function(category) {
        App.core.vent.trigger('app:log', 'Controller: "Category" route hit.');
        var view = new EpisodesView({ collection: new EpisodesCollection({ category: category }) });
        view.collection.fetch();
        window.App.layoutView.content.show(view);
        window.App.router.navigate('category/' + category);
    }

});
