var Marionette = require('backbone.marionette');
var DictionarySection = require('./views/dictionary-section');
var AppLayoutView = require('./views/layouts/app-layout');
var EpisodesView = require('./views/episodes');
var EpisodesCollection = require('./collections/episodes');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        App.layoutView = new AppLayoutView();

        App.layoutView.showChildView('dictionaries', new DictionarySection());
    },

    home: function() {
        App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');

        var view = new EpisodesView({ collection: new EpisodesCollection() });

        view.collection.fetch();
        window.App.layoutView.content.show(view);
    },

    category: function(category) {
        App.core.vent.trigger('app:log', 'Controller: "Category" route hit.');

        var view = new EpisodesView({ collection: new EpisodesCollection([], { category: category }) });

        view.collection.fetch();
        window.App.layoutView.content.show(view);
        window.App.router.navigate('category/' + category);
    }

});
