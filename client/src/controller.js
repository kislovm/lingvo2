var $ = require('jquery'),
    Marionette = require('backbone.marionette'),
    AppLayoutView = require('./views/layouts/app-layout'),
    EpisodesView = require('./views/episodes'),
    EpisodesCollection = require('./collections/episodes');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        App.layoutView = new AppLayoutView();
        App.headerHeight = $('header').height() + 50;
    },

    home: function() {
        if($(window).scrollTop() > App.headerHeight) $(window).scrollTop(App.headerHeight);
        App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');

        var view = new EpisodesView({ collection: window.App.data.episodes });

        view.collection.fetch();
        window.App.layoutView.content.show(view);
    },

    category: function(category) {
        if($(window).scrollTop() > App.headerHeight) $(window).scrollTop(App.headerHeight);
        App.core.vent.trigger('app:log', 'Controller: "Category" route hit.');
        var view = new EpisodesView({ collection: new EpisodesCollection([], { category: category }) });
        view.collection.fetch();
        window.App.layoutView.content.show(view);
        window.App.router.navigate('category/' + category);
    }

});
