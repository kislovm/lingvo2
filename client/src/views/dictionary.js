var Marionette = require('backbone.marionette'),
    UserModel = require('../models/user');

module.exports = DictionaryView = Marionette.ItemView.extend({

    model: UserModel,

    template: require('../../templates/dictionary.hbs'),

    events: {
        'click .show-next': 'showNext'
    },

    showNext: function(e) {
        e.preventDefault();
        this.onRender();
    },

    initialize: function() {
        this.listenTo(this.model, 'change:dictionary change:random', this.render);
    },

    getData: function() {
        if(this.model.get('random')) {

            this.model.set('customDictionary', _.shuffle(this.model.get('dictionary')).slice(-20));

            if(this.xhr)
                this.xhr.abort();

            this.xhr = this.model.save();

            return this.model.get('customDictionary');

          } else {

              return this.model.get('dictionary');

          }
    },

    onRender: function() {
        this.$el.find('.message').html(this.getData().map(function(word) {
            if (word.original) word = word.original + ' - ' + word.translation;

            return $('<li>'+ word +'</li>');
        }));

        this.$el.find('.show-next').toggleClass('show', this.model.get('random'));
    }

});
