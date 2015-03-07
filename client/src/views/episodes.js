var Marionette = require('backbone.marionette');

var itemView = Marionette.ItemView.extend({
    template: require('../../templates/episode.hbs'),

    events: {
        'click .show-more': 'showMore'
    }, showMore: function(el) {
        var $el = this.$el, $content = $el.find('.content'), linkText = $el.find('.show-more a').text().toUpperCase();
        if (!this.opened) {
            linkText = "Show less";
            $content.removeClass('hideContent').addClass('showContent');
            counter.reachGoal('show-more');
        } else {
            linkText = "Show more";
            $content.removeClass('showContent').addClass('hideContent');
        }

        this.opened = !this.opened;

        $el.find('.show-more a').text(linkText);

    },

    opened: false,

    tagName: 'article',

    className: 'article',

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(App.data.user, 'change:highlight', this.toggleHighlight);
    },

    toggleHighlight: function() {
        if(App.data.user.get('highlight'))
            this.$el.addClass('highlight-yes');
        else
            this.$el.removeClass('highlight-yes');
    },

    onRender: function() {
        this.toggleHighlight();
    }

});

module.exports = CollectionView = Marionette.CollectionView.extend({
    initialize: function() {
        var _this = this;
        this.$el.prepend('<div class="loading-spinner">');

        //Здесь этому не место. Нужно вынести в глобал и тригерить эвент или сделать вью для ленты.
        $(window).scroll(function() {
            if ($(window).scrollTop() + $(window).height() > ($('body').height() - 100))
                if(!App.data.user.get('random'))
                    _this.collection.increment();
            counter.reachGoal('scroll-down');
        });
        this.listenTo(this.collection, 'change', this.render);
        this.listenTo(App.data.user, 'sync', this._onDifficultyChange);
    },

    _getArticles: function() {
        if(!this._articles) this._articles = $('.articles');

        return this._articles;
    },

    _onDifficultyChange: function() {
        var articles = this._getArticles(),
            collection = this.collection;

        collection.reset();
        collection.page = '0';

        if(this.xhr && this.xhr.readyState < 4)
            this.xhr.abort();

        articles.addClass('loading');

        this.xhr = collection
            .fetch()
            .always(function() {
                articles.removeClass('loading');
            });
    },

    childView: itemView
});
