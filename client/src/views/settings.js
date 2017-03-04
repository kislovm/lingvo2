var Marionette = require('backbone.marionette');
var $ = require('jquery');

module.exports = Marionette.View.extend({

    events: {
        'click .settings-header': 'close',
        'change .settings-radio': 'radioChange',
        'change .functions-checkbox-settings': 'sourceChange'
    },

    template: require('../../templates/settings.hbs'),

    initialize: function() {
        this.listenTo(App.data.user, 'change:source', this.setSources, this);
    },

    onRender: function() {
        this.setSources();
    },

    setSources: function() {
        var sources = App.data.user.get('source');

        sources.forEach(function(source) {
            this.$el.find('.functions-checkbox-settings[value="' + source + '"]').prop('checked', true);
        }, this);
    },

    radioChange: function() {
        var val = this.$el.find('.settings-radio:checked').val();
        this.$el.find('.level').text(val);
        App.data.user.set('difficulty', val.toLowerCase());
    },

    sourceChange: function() {
        App.data.user.set('source', Array.prototype.map.call(this.$el.find('.functions-checkbox-settings:checked'),
            function(el) {
                return el.value;
            }));

        App.data.user.save();
    },

    close: function() {
        $('body').removeClass('popup');
    }
});
