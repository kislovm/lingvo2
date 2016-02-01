var $ = require('jquery');
var Marionette = require('backbone.marionette');
var ModuiPopup = require('modui-popup');
var WordPopup = require('./word-popup');
var Model = require('backbone').Model;

module.exports = Marionette.ItemView.extend({
    template: require('../../templates/episode.hbs'),

    events: {
        'click .episode-more': 'showMore',
        'click .illustration': 'showMore',
        'click .word': 'openPopup'
    },

    openPopup: function(e) {
        var target = $(e.currentTarget);
        var word = target.text().match(/(\w+|-|—|–|')+/g);

        App.core.vent.trigger('popup:show');
        this.xhr = $.get('/translate/' + word, 'json');
        this.xhr
            .then((function(data) {
                data.word = word;
                data.translations = data.translations.slice(0,3);

                ModuiPopup.open({
                    target : target,
                    position : 'top center',
                    contents : new WordPopup({ model: new Model(data) })
                });
            }).bind(this));
    },

    onPopupShow: function() {
        if(this.xhr) {
            this.xhr.abort();
        }
    },

    showMore: function() {
        var opened = this.opened;

        this.$el.find('.episode-body').removeClass('hidden');
        this.$el.find('.episode-more').addClass('hidden');
        if (opened) counter.reachGoal('show-more');

        this.opened = !opened;

    },

    opened: false,

    tagName: 'article',

    className: 'article',

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(App.core.vent, 'popup:show', this.onPopupShow);
        //this.listenTo(App.data.user, 'change:highlight', this.toggleHighlight);
    },

    toggleHighlight: function() {
        //this.$el.toggleClass('highlight-yes', !!App.data.user.get('highlight'));
    },

    onRender: function() {
        this.toggleHighlight();
        this.content = this.$el.find('.content');
        this.switcher = this.$el.find('.show-more a');
    }

});
