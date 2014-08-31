var Backbone = require('backbone'),
    EpisodeModel = require('../models/episode');

module.exports = EpisodesCollection = Backbone.Collection.extend({
    model:  EpisodeModel,
    url: '/api/episodes/all',

    initialize: function(options) {
        if(options && options.category) this.url = this.url + options.category;
    }

});
