var Marionette = require('backbone.marionette'),
    UserModel = require('../models/user');

module.exports = ControlsView = Marionette.ItemView.extend({

    model: UserModel,

    template: require('../../templates/controls.hbs'),

    events: {
        'change .highlight-switcher': 'toggleHighlight',
        'change .dict-highlight-switcher': 'toggleDictHighlight',
        'change .random-select': 'toggleRandom',
        'change .language-select': 'changeLanguage',
        'change .source-select': 'changeSource'
    },

    initialize: function() {
        this.render();
        this.model.on('change', this.render, this);
    },

    onRender: function() {
        this.$el.find('.highlight-switcher').val(this.model.get('highlight'));
        this.$el.find('.dict-highlight-switcher').val(this.model.get('highlightDict'));
        this.$el.find('.random-select').val(this.model.get('random') ? '1' : '0');
        this.$el.find('.language-select').val(this.model.get('language'));
        this.$el.find('.source-select').val(this.model.get('source'));
    },

    toggleHighlight: function() {
        this.model.set('highlight', this.$el.find('.highlight-switcher').is(':checked'));
    },

    toggleDictHighlight: function() {
        this.model.set('highlightDict', this.$el.find('.dict-highlight-switcher').is(':checked'));
        this.model.save();
    },

    toggleRandom: function() {
        this.model.set('random', !!parseInt(this.$el.find('.random-select').val()));
        this.model.save();
    },

    changeLanguage: function() {
        this.model.set('language', this.$el.find('.language-select').val());
        this.model.save();
    },

    changeSource: function() {
        this.model.set('source', this.$el.find('.source-select').val());
        this.model.save();
    }

});
