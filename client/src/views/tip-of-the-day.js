var Marionette = require('backbone.marionette');

module.exports = Marionette.ItemView.extend({
    template: false,

    events: {
        'click .close-cross': 'close'
    },

    close: function() {
        this.destroy();
    }
});