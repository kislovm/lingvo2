var Marionette = require('backbone.marionette');

module.exports = DifficultyView = Marionette.ItemView.extend({

    template: require('../../templates/difficulty_popup.hbs'),

    events: {
        'click .difficulty__submit': 'submit'
    },

    submit: function() {
        var val = this.$el.find(':radio:checked').val();

        if(!val) {
            alert('Укажите уровень владения языком.');
            return;
        }

        this.model
            .set('difficulty', this.$el.find(':radio:checked').val())
            .save();

        this.remove();
    }

});
