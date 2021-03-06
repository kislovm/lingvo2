var Backbone = require('backbone');
var $ = require('jquery');

module.exports = EpisodeModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: 'api/episodes/get/',
    parse: function(data) {
        if(!data || !data.title) return;

        var pubDate = data.publicationDate;
        if (!!pubDate) data.formattedDate = this._formatDate(pubDate);

        if(!data.processedTitle) {
            data.processedTitle = data.title.split(' ').map(function(word) {
                return '<span class="word">' + word + '</span>';
            }).join(' ');
        }

        if (!$(data.description).text().match(/\w/)) {
            data.description = data.body;
            data.body = '';
        }

        return data;
    },

    _formatDate: function(date) {
        date = new Date(date);

        return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('.');
    }
});
