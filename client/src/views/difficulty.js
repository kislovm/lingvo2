var $ = require('jquery'),
    Marionette = require('backbone.marionette'),
    ControlsView = require('./controls.js'),
    DictionaryView = require('./dictionary.js'),
    UserModel = require('../models/user');

module.exports = Marionette.View.extend({

    model: UserModel,

    template: require('../../templates/difficulty.hbs'),

    difficulties: [
        'General',
        'Business English',
        'For TOEFL',
        'For GMAT',
        'For GRE',
        'Irregular verbs'
    ],

    events: {
        'click .easier': 'easier',
        'click .harder': 'harder',
        'click .j-show-dictionary': 'showDictionary'
    },

    showDictionary: function() {
        var dictionary = $('.dictionary');

        if(dictionary.hasClass('hide')) {
            $('.j-show-dictionary').text('Hide dictionary');
            dictionary.removeClass('hide').delay(1).queue(function() {
                $(this).addClass("showing").dequeue();
            });
        } else {
            $('.j-show-dictionary').text('Show dictionary');
            dictionary.removeClass('showing').delay(150).queue(function() {
                $(this).addClass('hide').dequeue();
            });
        }

        $('.mobile-dictionary').toggleClass('hide');

    },

    initialize: function() {
        this.listenTo(this.model, 'change:difficulty', this.toggleDifficulty);
    },

    toggleDifficulty: function() {
        this.$el.find('.difficulty').text(this.model.get('difficulty'));
        this._updateDisabled();
    },

    onRender: function() {
        this.harderButton = this.$el.find('.harder');
        this.easierButton = this.$el.find('.easier');
        this._updateDisabled();

        new ControlsView({ model: this.model, el: this.$el.find('.user-controls') });
        new ControlsView({ model: this.model, el: $('.mobile-user-controls') });

        new DictionaryView({ model: this.model, el: $('.mobile-dictionary-view')} );
        new DictionaryView({ model: this.model, el: this.$el.find('.dictionary-view')} );
    },

    _updateDisabled: function() {
        var len = this.difficulties.length;

        this.harderButton.toggleClass('disabled', this.model.get('difficulty') == this.difficulties[len-1]);
        this.easierButton.toggleClass('disabled', this.model.get('difficulty') == this.difficulties[0]);
    },


    easier: function() {
        var difficulties = this.difficulties;

        if (this.model.get('difficulty') == this.difficulties[0]) return;

        var difficulty = this.difficulties[this.difficulties.indexOf(this.model.get('difficulty')) - 1];

        if(this.xhr && this.xhr.readyState < 4)
            this.xhr.abort();

        this.xhr = this.model.set('difficulty', difficulty).save();
    },

    harder: function() {
        var difficulties = this.difficulties;

        if (this.model.get('difficulty') == difficulties[difficulties.lenght-1]) return;

        var difficulty = this.difficulties[difficulties.indexOf(this.model.get('difficulty')) + 1];

        if(this.xhr && this.xhr.readyState < 4)
            this.xhr.abort();

        this.xhr = this.model.set('difficulty', difficulty).save();
    }

});
