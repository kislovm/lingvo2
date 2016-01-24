var Marionette = require('backbone.marionette');
var itemView = require('./episode');

module.exports = Marionette.CollectionView.extend({
    initialize: function() {
        this.listenTo(this.collection, 'change', this.render);
        this.listenTo(App.data.user, 'change:source', this._onDifficultyChange);
    },

    increment: function() {
        this.collection.increment();
    },

    _onDifficultyChange: function() {
        var collection = this.collection;

        collection.reset();
        collection.page = '0';

        if(this.xhr && this.xhr.readyState < 4) {
            this.xhr.abort();
        }

        if(this._timeout) {
            clearTimeout(this._timeout);
        }

        this._timeout = setTimeout(this._fetchCollection.bind(this), 500);
    },

    _fetchCollection: function() {
        this.xhr = this.collection
            .fetch();
    },

    childView: itemView
});
