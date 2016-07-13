var Marionette = require('backbone.marionette');

module.exports = Marionette.ItemView.extend({

    template: false,

    events: {
        'change .switch-lang': 'change'
    },

    initialize: function() {
        var lang = this.model.get('language');
        this.$el.find('.switch-lang[value="' + lang + '"]').prop('checked', true);
    },

    change: function() {
        yaCounter.reachGoal('change-lang');
        this.model.set('language', this.$el.find('.switch-lang:checked').val());
        this.model.save();
    }

});
