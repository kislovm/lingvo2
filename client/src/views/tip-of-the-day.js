var Marionette = require('backbone.marionette');

module.exports = Marionette.ItemView.extend({
    template: false,

    events: {
        'click .close-cross': 'close'
    },

    initialize: function() {
        if(App.data.user.get('hideHint') === true) {
            this.destroy();
        }
    },

    close: function() {
        yaCounter.reachGoal('hint-click');
        App.data.user.set('hideHint', true).save();
        this.destroy();
    }
});
