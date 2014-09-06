var Backbone = require('backbone');

module.exports = EpisodeModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: 'api/episode',
    parse: function(data) {
        if(data) {
            var date = new Date(data.publicationDate);

            data.formattedDate = [date.getDay(), date.getMonth(), date.getFullYear()].join('.');

            return data;
        }
    }
});
