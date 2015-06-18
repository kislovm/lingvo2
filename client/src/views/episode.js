var $ = require('jquery');
var Marionette = require('backbone.marionette');
var ModuiPopup = require('modui-popup');
var WordPopup = require('./word-popup');
var Model = require('backbone').Model;

module.exports = Marionette.ItemView.extend({
    template: require('../../templates/episode.hbs'),

    events: {
        'click .show-more': 'showMore',
        'click .word': 'openPopup'
    },

    openPopup: function(e) {
        var target = $(e.currentTarget);

        ModuiPopup.open({
            target : target,
            position : 'top center',
            contents : new WordPopup({ model: new Model({ word: target.text().match(/\w+/) }) })
        });
    },

    showMore: function() {
        var opened = this.opened;

        this.content.toggleClass('hideContent', opened);
        this.switcher.text(opened ? 'Show more' : 'Show less');

        if (opened) counter.reachGoal('show-more');

        this.opened = !opened;

    },

    opened: false,

    tagName: 'article',

    className: 'article',

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(App.data.user, 'change:highlight', this.toggleHighlight);
    },

    toggleHighlight: function() {
        this.$el.toggleClass('highlight-yes', !!App.data.user.get('highlight'));
    },

    onRender: function() {
        this.toggleHighlight();
        this.content = this.$el.find('.content');
        this.switcher = this.$el.find('.show-more a');
    }

});