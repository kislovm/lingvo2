var Backbone = require('backbone');

module.exports = EpisodeModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: 'api/episode',
    parse: function(data) {
        if(!data) return;

        var pubDate = data.publicationDate;
        var description = data.description;

        if (!!pubDate) data.formattedDate = this._formatDate(pubDate);

        data.description = description.split(' ').map(function (word) {
            return word;
        }).join(' ');

        return data;
    },

    _formatDate: function(date) {
        date = new Date(date);

        return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('.');
    }
});
