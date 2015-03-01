var Backbone = require('backbone');

module.exports = EpisodeModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: 'api/episode',
    parse: function(data) {
        if(data) {
            if(!data.publicationDate) return data;

            var date = new Date(data.publicationDate);

            data.formattedDate = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('.');

            return data;
        }
    }
});
