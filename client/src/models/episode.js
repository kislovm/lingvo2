var Backbone = require('backbone');
var $ = require('jquery');

module.exports = EpisodeModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: 'api/episode',
    parse: function(data) {
        if(!data) return;

        var pubDate = data.publicationDate;

        if(!data.processedTitle) {
            data.processedTitle = data.title.split(' ').map(function(word) {
                return '<span class="word">' + word + '</span>';
            }).join(' ');
        }

        if (!!pubDate) data.formattedDate = this._formatDate(pubDate);

        console.log($(data.description).text());

        if (!$(data.description).text().match(/\w/)) {
            data.description = data.body.slice(0, 120) + '...';
            data.body = data.body.slice(120);
        }



        return data;
    },

    _formatDate: function(date) {
        date = new Date(date);

        return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('.');
    }
});
