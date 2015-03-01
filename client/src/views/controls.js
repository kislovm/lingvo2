var Marionette = require('backbone.marionette'),
    UserModel = require('../models/user');

module.exports = ControlsView = Marionette.ItemView.extend({

    model: UserModel,

    template: require('../../templates/controls.hbs'),

    events: {
        'change .highlight-switcher': 'toggleHighlight',
        'change .random-select': 'toggleRandom'
    },

    initialize: function() {
        this.render();
        this.model.on('change', this.render, this);
    },

    onRender: function() {
        this.$el.find('.highlight-switcher').val(this.model.get('highlight'));
        this.$el.find('.random-select').val(this.model.get('random') ? '1' : '0');
    },

    toggleHighlight: function() {
        this.model.set('highlight', this.$el.find('.highlight-switcher').is(':checked'));
    },

    toggleRandom: function() {
        this.model.set('random', !!parseInt(this.$el.find('.random-select').val()));
    }

});
