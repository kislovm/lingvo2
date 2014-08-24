var Marionette = require('backbone.marionette'),
    UserModel = require('../models/user');

module.exports = DifficultyView = Marionette.ItemView.extend({

    model: UserModel,

    template: require('../../templates/difficulty.hbs'),

    difficulties: [
        'easy',
        'intermediate',
        'hard'
    ],

    events: {
        'click .easier': 'easier',
        'click .harder': 'harder'
    },

    initialize: function() {

        this.listenTo(this.model, 'change', this.render);

    },


    easier: function() {
        if (this.difficulties.indexOf(this.model.get('difficulty')) === 0) return;

        var difficulty = this.difficulties[this.difficulties.indexOf(this.model.get('difficulty')) - 1];

        this.model.set('difficulty', difficulty).save();
    },

    harder: function() {
        if (this.difficulties.indexOf(this.model.get('difficulty')) + 1 === this.difficulties.length) return;

        var difficulty = this.difficulties[this.difficulties.indexOf(this.model.get('difficulty')) + 1];

        this.model.set('difficulty', difficulty).save();
    }

});
