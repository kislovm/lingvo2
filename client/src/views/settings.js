var Marionette = require('backbone.marionette');
var $ = require('jquery');

module.exports = Marionette.ItemView.extend({

    events: {
        'click .settings-header': 'close',
        'change .settings-radio': 'radioChange'
    },

    template: require('../../templates/settings.hbs'),

    radioChange: function() {
        var val = this.$el.find('.settings-radio:checked').val();
        this.$el.find('.level').text(val);
        App.data.user.set('difficulty', val.toLowerCase());
    },

    close: function() {
        $('body').removeClass('popup');
    }
});
