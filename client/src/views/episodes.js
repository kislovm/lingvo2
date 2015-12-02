var $ = require('jquery');
var Marionette = require('backbone.marionette');
var itemView = require('./episode');

module.exports = CollectionView = Marionette.CollectionView.extend({
    initialize: function() {
        this.$el.prepend('<div class="loading-spinner">');

        this.listenTo(this.collection, 'change', this.render);
        this.listenTo(App.data.user, 'sync', this._onDifficultyChange);
    },

    _getArticles: function() {
        if(!this._articles) this._articles = $('.articles');

        return this._articles;
    },

    _onDifficultyChange: function() {
        var articles = this._getArticles(),
            collection = this.collection,
            _this = this;

        collection.reset();
        collection.page = '0';

        if(this.xhr && this.xhr.readyState < 4)
            this.xhr.abort();

        articles.addClass('loading');

        if(this._timeout)
            clearTimeout(this._timeout);

        this._timeout = setTimeout(function() {
            _this._fetchCollection();
        }, 500);
    },

    _fetchCollection: function() {
        var article = this._getArticles();

        this.xhr = this.collection
            .fetch()
            .always(function() {
                article.removeClass('loading');
            });
    },

    childView: itemView
});
