var Backbone = require('backbone');

module.exports = EpisodeModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: 'api/episode'
});
