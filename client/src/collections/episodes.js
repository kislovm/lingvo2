var Backbone = require('backbone'),
    EpisodeModel = require('../models/episode');

module.exports = EpisodesCollection = Backbone.Collection.extend({
    model:  EpisodeModel,
    url: function() { return '/api/episodes/' + this.category + '/'  + this.page; },

    initialize: function(data, options) {
        this.page = '0';
        this.category = options && options.category || 'all';
    },

    increment: function() {
        if (!this.xhr || this.xhr.readyState == 4) {
            this.page++;
            this.xhr = this.fetch();
        }
    },

    parse: function(data) {
        if(this.toJSON() && this.toJSON().length) return this.toJSON().concat(data);
        else return data;
    }

});
