var Marionette = require('backbone.marionette');
var DictionarySection = require('./views/dictionary-section');
var Settings = require('./views/settings');
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

        $(window).scroll(function() {
            var el = $('body');
            clearTimeout($.data(this, 'scrollTimer'));
            $.data(this, 'scrollTimer', setTimeout(function() {
                if($(window).scrollTop() == $(document).height() - $(window).height()) {
                    App.layoutView.content.currentView.increment()
                }
            }, 50));
        });

        App.languageView = new LanguageView({ el: $('.lang-select'), model: App.data.user });

        App.layoutView.showChildView('dictionaries', new DictionarySection());
        App.layoutView.showChildView('settings', new Settings());
        App.tipOfTheDay = new TipOfTheDayView({ el: $('.tip-of-the-day') });
    },

    home: function() {
        App.core.vent.trigger('app:log', 'Controller: "Home" route hit.');

        var view = new EpisodesView({ collection: new EpisodesCollection() });

        view.collection.fetch();
        App.layoutView.content.show(view);
    },

    category: function(category) {
        App.core.vent.trigger('app:log', 'Controller: "Category" route hit.');

        var view = new EpisodesView({ collection: new EpisodesCollection([], { category: category }) });

        view.collection.fetch();
        App.layoutView.content.show(view);
        App.router.navigate('category/' + category);
    }

});
