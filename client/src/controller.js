var Marionette = require('backbone.marionette');
var DictionarySection = require('./views/dictionary-section');
var LoginForm = require('./views/login');
var Settings = require('./views/settings');
var MobileFooter = require('./views/mobile-footer');
var AppLayoutView = require('./views/layouts/app-layout');
var EpisodesView = require('./views/episodes');
var EpisodesCollection = require('./collections/episodes');
var TipOfTheDayView = require('./views/tip-of-the-day');
var MenuView = require('./views/menu');
var LanguageView = require('./views/language');
var $ = require('jquery');

module.exports = Marionette.Controller.extend({
    initialize: function() {
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        App.layoutView = new AppLayoutView();

        App.core.vent.bind('router:inited', function() {
            App.menuView = new MenuView({ el: $('.menu' )});
        }, this);

        App.core.vent.bind('show-login', function() {
            App.layoutView.showChildView('dictionaries', new LoginForm());
        }, this);

        App.core.vent.bind('dictionary:show', this.onShowDictionary, this);
        App.core.vent.bind('dictionary:close', this.onCloseDictionary, this);

        $(window).scroll(function() {
            clearTimeout($.data(this, 'scrollTimer'));
            $.data(this, 'scrollTimer', setTimeout(function() {
                if($(window).scrollTop() >= $(document).height() - ($(window).height() * 2)) {
                    App.layoutView.content.currentView.increment()
                }
            }, 50));
        });

        var centerBlock = $('.center-block');

        centerBlock.scroll(function() {
            clearTimeout($.data(this, 'scrollTimer'));
            $.data(this, 'scrollTimer', setTimeout(function() {
                if(centerBlock.scrollTop() >= $(document).height() - (centerBlock.height() * 2)) {
                    App.layoutView.content.currentView.increment()
                }
            }, 50));
        });

        var onOrientationChange = function() {
          if(window.matchMedia("(orientation: portrait)").matches) // Portrait
          {
            $('head').append('<meta name="viewport" content="width=device-width, initial-scale=.75, maximum-scale=.75" />');
          } else // Landscape
          {
            $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />');
          }
        };

        onOrientationChange();

        $(window).on('orientationchange', onOrientationChange);

        App.languageView = new LanguageView({ el: $('.lang-select'), model: App.data.user });

        if(App.data.user.get('registred') === true) {
            App.layoutView.showChildView('dictionaries', new DictionarySection());
            App.layoutView.showChildView('settings', new Settings());
        } else {
            App.layoutView.showChildView('dictionaries', new LoginForm());
        }

        App.layoutView.showChildView('mobileFooter', new MobileFooter());

        App.tipOfTheDay = new TipOfTheDayView({ el: $('.tip-of-the-day') });
    },

    onCloseDictionary: function() {
        $('.dictionaries-section').removeClass('show');
    },

    onShowDictionary: function() {
        $('.dictionaries-section').addClass('show').appendTo('body');
    },

    home: function() {
        App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');

        var view = new EpisodesView({ collection: new EpisodesCollection() });

        view.collection.fetch();
        App.layoutView.content.show(view);
    },

    category: function(category) {
        window.yaCounter.reachGoal('category-click', { name: category });
        App.core.vent.trigger('app:log', 'Controller: "Category" route hit.');

        var view = new EpisodesView({ collection: new EpisodesCollection([], { category: category }) });

        view.collection.fetch();
        App.layoutView.content.show(view);
        App.router.navigate('category/' + category);
    }

});
