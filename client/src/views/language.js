var Marionette = require('backbone.marionette');

module.exports = Marionette.ItemView.extend({

    template: false,

    LANGUAGES: {
        'chinese': 'Китайский',
        'arabic': 'Арабский',
        'portugal': 'Португальский',
        'russian': 'Русский',
        'spanish': 'Испанский',
        'turkish': 'Турецкий'
    },

    events: {
        'change .switch-lang': 'change'
    },

    initialize: function() {
        var lang = this.model.get('language');
        this.$el.find('.switch-lang[value="' + lang + '"]').prop('checked', true);
        this.$el.find('.language-js').text('Язык перевода: ' + this.LANGUAGES[this.$el.find('.switch-lang:checked').val()]);
    },

    change: function() {
        yaCounter.reachGoal('change-lang');
        this.model.set('language', this.$el.find('.switch-lang:checked').val());
        this.$el.find('.language-js').text('Язык перевода: ' + this.LANGUAGES[this.$el.find('.switch-lang:checked').val()]);
        this.model.save();
    }

});
