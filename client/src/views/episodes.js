var Marionette = require('backbone.marionette');

var itemView = Marionette.ItemView.extend({
    template: require('../../templates/episode.hbs'),

    tagName: 'article',

    className: 'article',

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    }

});

module.exports = CollectionView = Marionette.CollectionView.extend({
    // el: $(".show-more"),
    events: {
        'click .show-more a': 'showMore'
    },
    showMore: function(el) {
        alert("LALKA");
        var $this = $(this);
        var $content = this.el.parent().prev("div.content");
        var linkText = $this.text().toUpperCase();
        alert($content.getClass());
        if(linkText === "SHOW MORE") {
          linkText = "Show less";

          $content.switchClass("hideContent", "showContent", 100);
        } else {
          linkText = "Show more";
          $content.switchClass("showContent", "hideContent", 100);
        }

        $this.text(linkText);
    },

    initialize: function() {
        var _this = this;

        //Здесь этому не место. Нужно вынести в глобал и тригерить эвент или сделать вью для ленты.
        $(window).scroll(function() {
            if($(window).scrollTop() + $(window).height() > ($('body').height() - 100))
                _this.collection.increment();
                counter.reachGoal('scroll-down');
        });
        this.listenTo(this.collection, 'change', this.render);
        this.listenTo(App.data.user, 'sync', this._onDifficultyChange);
    },

    _onDifficultyChange: function() {
        this.collection.reset();
        this.collection.page = '0';
        this.collection.fetch();
    },

    childView: itemView
});
