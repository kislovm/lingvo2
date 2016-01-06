var Marionette = require('backbone.marionette');
var DictionarySection = require('./views/dictionary-section');
var Settings = require('./views/settings');
var AppLayoutView = require('./views/layouts/app-layout');
var EpisodesView = require('./views/episodes');
var EpisodesCollection = require('./collections/episodes');
var TipOfTheDayView = require('./views/tip-of-the-day');
var $ = require('jquery');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function() {
        App.core.vent.trigger('app:log', 'Controller: Initializing');
        App.layoutView = new AppLayoutView();

        $('.center-content').scroll(function() {
            var el = $(this);
            clearTimeout($.data(this, 'scrollTimer'));
            $.data(this, 'scrollTimer', setTimeout(function() {
                if(el.scrollTop() + 200 >= el.prop('scrollHeight') - el.height()) {
                    App.layoutView.content.currentView.increment()
                }
            }, 50));
        });

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
