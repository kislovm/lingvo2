var Marionette = require('backbone.marionette');
var DictionaryCollection = require('../collections/dictionary');
var $ = require('jquery');

module.exports = Marionette.View.extend({

    collection: new DictionaryCollection(),

    template: require('../../templates/dictionary.hbs'),
    wordTemplate: require('../../templates/dictionary-word.hbs'),

    events: {
        'click .transcription-f': 'checkboxClick'
    },

    initialize: function() {
        this.listenTo(this.model, 'sync', this.fetchData);
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(App.core.vent, 'dict:update', this.fetchData);
        this.fetchData();
    },

    dictionaryScroll: function() {
        if(!this.isSent) {
            yaCounter.reachGoal('dictionary-scroll');
            this.isSent = true;
        }
    },

    setSortByTime: function(sortByTime) {
        this.sortByTime = sortByTime;
        this.render();
    },

    checkboxClick: function() {
        yaCounter.reachGoal('checkbox-click');
    },

    cancel: function() {
        yaCounter.reachGoal('cancel-click');
        this.$el.find(':checkbox').prop('checked', false);
    },

    delete: function() {
        yaCounter.reachGoal('delete-click');
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

    getComparator: function() {
        var comparator;
        if(this.sortByTime) {
            comparator = function(model) {
                return -model.get('id');
            }
        } else {
            comparator = function(model) {
                return model.get('phrase').toLowerCase();
            }
        }
        return comparator;
    },

    onRender: function() {
        this.collection.set(this.collection.sortBy(this.getComparator(), this));
        this.$el.find('.word-js').html(this.collection.toJSON().map(function(word) {
            if(typeof word.translations === 'string') {
                word.translations = JSON.parse(word.translations);
            }
            return this.wordTemplate(word);
        }, this));
        this.$el.find('.word-js').scroll(this.dictionaryScroll.bind(this));
    }

});
