var Marionette = require('backbone.marionette'),
    EpisodesView = require('./episodes'),
    EpisodesCollection = require('../collections/episodes');

module.exports = MenuView = Marionette.ItemView.extend({

    template: require('../../templates/menu.hbs'),

    initialize: function() {
        this.listenTo(App.router, 'route', this.selectActive);
    },

    selectActive: function() {
        //ОЛОЛО БЫДЛОКОД

        $('.topic-link').removeClass('selected');
        $('.mobile-navigation > a').removeClass('selected');
        var theme = window.location.hash.slice(window.location.hash.indexOf('/', window.location.hash.indexOf('/') + 1) + 1);
        if (theme !== 'general') {
          $('.topic-link').each(function() {
            if($(this).parent().attr('href').indexOf(theme) != -1) {
              $(this).addClass('selected');
            }
          });
        } else {
          $('.topic-link').first().addClass('selected');
        }
        if (theme !== 'general') {
          $('.mobile-navigation').each(function() {
            if($(this).parent().attr('href').indexOf(theme) != -1) {
              $(this).addClass('selected');
            }
          });
        } else {
          $('.mobile-navigation').first().addClass('selected');
        }
    },

    events: {
      'mouseover .topic-link': 'switchTheme',
      'click .topic-link': 'pushState'
    },

    switchTheme: function(el) {
      var theme_url = $(el.target).parent().attr('href');
      var origUrl = Backbone.history.fragment;
      var theme = theme_url.slice(theme_url.indexOf('/', theme_url.indexOf('/') + 1) + 1);
      var topic_second_slash = origUrl.indexOf('/', origUrl.indexOf('/') + 1);
      if (theme === '#') {
        theme = 'general';
      }
      var newUrl = origUrl.slice(0, topic_second_slash + 1) + theme;
      if(newUrl[0] !== '#') {
        newUrl = '#' + newUrl;
      }

      $(el.target).parent().attr('href', newUrl);
    }
});
