module.exports = require('./episodes').extend({
    url: function() {
        return '/api/episodes/get/' + this.episodeId;
    },

    initialize: function(data, options) {
        this.episodeId = options.episodeId;
    }
});
