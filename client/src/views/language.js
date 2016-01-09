var Marionette = require('backbone.marionette');

module.exports = Marionette.ItemView.extend({

    template: false,

    events: {
        'change .switch-lang': 'change'
    },

    initialize: function() {
        this.$el.find('.switch-lang').val(this.model.get('language'));
    },

    change: function() {
        this.model.set('language', this.$el.find('.switch-lang').val());
        this.model.save();
    }

});
