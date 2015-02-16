var Marionette = require('backbone.marionette'),
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
        'click .harder': 'harder'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    onRender: function() {
        this.harderButton = this.$el.find('.harder');
        this.easierButton = this.$el.find('.easier');
        this._updateDisabled();
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
