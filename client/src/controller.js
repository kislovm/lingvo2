var Marionette = require('backbone.marionette');

var UiController = require('./ui-controller');

var EpisodesView = require('./views/episodes');
var EpisodesCollection = require('./collections/episodes');

var EpisodeView = require('./views/episode');
var EpisodeModel = require('./models/episode');


module.exports = Marionette.Controller.extend({
    initialize: function() {
        App.uiController = new UiController();
    },

    home: function() {
        var view = new EpisodesView({ collection: new EpisodesCollection() });

        view.collection.fetch();
        App.layoutView.content.show(view);
    },

    category: function(category) {
        window.yaCounter.reachGoal('category-click', { name: category });

        var view = new EpisodesView({ collection: new EpisodesCollection([], { category: category }) });

        view.collection.fetch();
        App.layoutView.content.show(view);
        App.router.navigate('category/' + category);
    },

    episode: function(episodeId) {
        var view = new EpisodeView({ model: new EpisodeModel({ _id: episodeId, singlePage: true }) });

        view.model.fetch();
        App.layoutView.content.show(view);
        App.router.navigate('episode/' + episodeId);
    }

});
