var Marionette = require('backbone.marionette');

module.exports = Marionette.ItemView.extend({

    events: {
        'click .settings-header': 'toggle'
    },

    template: require('../../templates/settings.hbs'),

    toggle: function() {
        this.$el.find('.settings-content').slideToggle();
    }
});
