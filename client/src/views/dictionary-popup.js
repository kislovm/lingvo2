var Marionette = require('backbone.marionette');
var $ = require('jquery');

module.exports = Marionette.View.extend({

    events: {
        'change select': '_onChange',
        'change input': '_onChange'
    },

    _onChange: function() {
        this.model.set({
                selected: this.$el.find('select').val(),
                autosave: this.$el.find('input').is(":checked")
            })
            .save();
    },

    template: require('../../templates/dictionary-popup.hbs'),

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    onRender: function() {
        this.$el.find('select').val(this.model.get('selected'));
    }

});
