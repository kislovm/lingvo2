var Marionette = require('backbone.marionette');

var $ = require('jquery');

var AppLayoutView = require('./views/layouts/app-layout');

var MenuView = require('./views/menu');
var LanguageView = require('./views/language');
//var TipOfTheDayView = require('./views/tip-of-the-day');
var MyWordView = require('./views/myword');
var LoginFormView = require('./views/login');
//var MobileFooterView = require('./views/mobile-footer');

var DictionarySectionView = require('./views/dictionary-section');
var SettingsView = require('./views/settings');

module.exports = Marionette.Controller.extend({
    initialize: function() {
        this.listenTo(App.core.vent, 'router:inited', this.onRouterInited);
        this.listenTo(App.core.vent, 'show-login', this.onShowLogin);

        this.listenTo(App.core.vent, 'dictionary:show', this.onShowDictionary);
        this.listenTo(App.core.vent, 'dictionary:close', this.onCloseDictionary);

        //init page layout
        App.layoutView = new AppLayoutView();
        //App.layoutView.showChildView('mobileFooter', new MobileFooterView());
        //App.tipOfTheDay = new TipOfTheDayView({ el: $('.tip-of-the-day') });
        App.languageView = new LanguageView({
            el: $('.lang-select'),
            model: App.data.user
        });
        App.mywordView = new MyWordView({
            el: $('body')
        });

        this.onOrientationChange();
        $(window).on('orientationchange', this.onOrientationChange);

        if (App.data.user.get('registred') === true) {
            App.layoutView.showChildView('dictionaries', new DictionarySectionView());
            App.layoutView.showChildView('settings', new SettingsView());
        } else {
            App.layoutView.showChildView('authorization', new LoginFormView());
        }

        $(window).scroll(this.onWindowScroll);
    },

    onRouterInited: function() {
        App.menuView = new MenuView({
            el: $('.menu')
        });
    },

    onShowLogin: function() {
        App.layoutView.showChildView('authorization', new LoginFormView());
    },

    onOrientationChange: function() {
        if (window.matchMedia("(orientation: portrait)").matches) {
            $('head').append('<meta name="viewport" content="width=device-width, initial-scale=.75, maximum-scale=.75" />');
        } else {
            $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />');
        }
    },

    onWindowScroll: function() {
        clearTimeout($.data(this, 'scrollTimer'));
        $.data(this, 'scrollTimer', setTimeout(function() {
            if ($(window).scrollTop() >= $(document).height() - ($(window).height() * 2)) {
                App.layoutView.content.currentView.increment()
            }
        }, 50));
    },

    onCloseDictionary: function() {
        $('.dictionaries-section').removeClass('show');
        $('body').removeClass('body-fixed');
    },

    onShowDictionary: function() {
        $('.dictionaries-section').addClass('show').appendTo('body');
        $('body').addClass('body-fixed');
    }
});
