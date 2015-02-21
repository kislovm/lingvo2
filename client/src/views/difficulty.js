var Marionette = require('backbone.marionette'),
    ControlsView = require('./controls.js'),
    UserModel = require('../models/user');

module.exports = DifficultyView = Marionette.ItemView.extend({

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
        if($('.dictionary').hasClass('hide')) {
            $('.j-show-dictionary').text('Hide dictionary');
            $('.dictionary').removeClass('hide').delay(1).queue(function() {
                $(this).addClass("showing").dequeue();
            });
        } else {
            $('.j-show-dictionary').text('Show dictionary');
            $('.dictionary').removeClass('showing').delay(150).queue(function() {
                $(this).addClass('hide').dequeue();
            });
        }

        $('.mobile-dictionary').toggleClass('hide');

    },

    initialize: function() {
        this.listenTo(this.model, 'change:difficulty', this.render);
    },

    onRender: function() {
        this.harderButton = this.$el.find('.harder');
        this.easierButton = this.$el.find('.easier');
        this._updateDisabled();
        this.controlsView = new ControlsView({ model: this.model, el: this.$el.find('.user-controls') })
    },

    _updateDisabled: function() {
        if (this.difficulties.indexOf(this.model.get('difficulty')) === 0) {
            this.easierButton.addClass('disabled');
        } else if (this.difficulties.indexOf(this.model.get('difficulty')) + 1 === this.difficulties.length) {
            this.harderButton.addClass('disabled');
        }
    },


    easier: function() {
        if (this.difficulties.indexOf(this.model.get('difficulty')) === 0) return;

        var difficulty = this.difficulties[this.difficulties.indexOf(this.model.get('difficulty')) - 1];

        this.model.set('difficulty', difficulty).save();
    },

    harder: function(el) {
        if (this.difficulties.indexOf(this.model.get('difficulty')) + 1 === this.difficulties.length) return;

        var difficulty = this.difficulties[this.difficulties.indexOf(this.model.get('difficulty')) + 1];

        this.model.save({ difficulty: difficulty });
    }

});
