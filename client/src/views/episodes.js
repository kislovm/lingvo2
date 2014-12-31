var Marionette = require('backbone.marionette');

var itemView = Marionette.ItemView.extend({
  template: require('../../templates/episode.hbs'),

  events: {
    'click .show-more': 'showMore'
  },
  showMore: function(el) {
    var $el = this.$el,
    $content = $el.find('.content'),
    linkText = $el.find('.show-more a').text().toUpperCase();
    if(!this.opened) {
      linkText = "Show less";
      $content.removeClass('hideContent').addClass('showContent');
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
  }

});

module.exports = CollectionView = Marionette.CollectionView.extend({
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
