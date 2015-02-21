var Marionette = require('backbone.marionette'),
    UserModel = require('../models/user');

module.exports = ControlsView = Marionette.ItemView.extend({

    model: UserModel,

    template: require('../../templates/controls.hbs'),

    events: {
        'change .highlight-switcher': 'toggleHighlight'
    },

    initialize: function() {
        this.render();
    },

    toggleHighlight: function() {
        this.model.set('highlight', !this.model.get('highlight'));
    }

});
