var Marionette = require('backbone.marionette');
var DictionaryCollection = require('../collections/dictionary');
var $ = require('jquery');

module.exports = Marionette.ItemView.extend({

    collection: new DictionaryCollection(),

    template: require('../../templates/dictionary.hbs'),
    wordTemplate: require('../../templates/dictionary-word.hbs'),

    events: {
        'click .word-cancel': 'cancel',
        'click .word-delete': 'delete'
    },

    initialize: function() {
        this.listenTo(this.model, 'sync', this.fetchData);
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(App.core.vent, 'dict:update', this.fetchData);
        this.fetchData();
    },

    cancel: function() {
        this.$el.find(':checkbox').prop('checked', false);
    },

    delete: function() {
        var value = {
            words: Array.prototype.map.call(this.$el.find(':checkbox:checked'),
                function(el) {
                    return el.value;
                })
        };

        $.post('/dictionary/word/delete', value, function () {
            App.core.vent.trigger('dict:update');
        }, 'json');
    },

    showNext: function(e) {
        e.preventDefault();
        this.onRender();
    },

    fetchData: function() {
        this.collection.fetch({ reset: true });
    },

    onRender: function() {
        this.$el.prepend(this.collection.toJSON().map(function(word) {
            return this.wordTemplate(word);
        }, this));
    }

});
