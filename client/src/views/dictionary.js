var $ = require('jquery');
var Marionette = require('backbone.marionette');
var UserModel = require('../models/user');
var DictionaryCollection = require('../collections/dictionary');

module.exports = DictionaryView = Marionette.ItemView.extend({

    model: UserModel,

    collection: new DictionaryCollection(),

    template: require('../../templates/dictionary.hbs'),

    events: {
        'click .show-next': 'showNext'
    },

    showNext: function(e) {
        e.preventDefault();
        this.onRender();
    },

    initialize: function() {
        this.listenTo(this.model, 'sync', this.fetchData);
        this.listenTo(this.collection, 'reset', this.render);
        this.fetchData();
    },

    fetchData: function() {
        this.collection.fetch({ reset: true });
    },

    onRender: function() {
        this.$el.find('.message').html(this.collection.toJSON().map(function(word) {
            if (word.original) word = word.original + ' [' + word.transcription + '] ' + ' — ' + word.translation;

            return $('<li>'+ word +'</li>');
        }));

        this.$el.find('.show-next').toggleClass('show', !!this.model.get('random'));
    }

});
