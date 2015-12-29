var Marionette = require('backbone.marionette');
var DictionaryCollection = require('../collections/dictionary');

module.exports = Marionette.ItemView.extend({

    collection: new DictionaryCollection(),

    template: require('../../templates/dictionary.hbs'),
    wordTemplate: require('../../templates/dictionary-word.hbs'),

    showNext: function(e) {
        e.preventDefault();
        this.onRender();
    },

    initialize: function() {
        this.listenTo(this.model, 'sync', this.fetchData);
        this.listenTo(this.collection, 'reset', this.render);
        this.model = App.data.user;
        this.fetchData();
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
