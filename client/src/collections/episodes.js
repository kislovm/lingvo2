var Backbone = require('backbone'),
    EpisodeModel = require('../models/episode');

module.exports = EpisodesCollection = Backbone.Collection.extend({
    model:  EpisodeModel,
    url: function() { return '/api/episodes/' + this.category },

    initialize: function(options) {
        this.category = options && options.category || 'all';
    }

});
