var Marionette = require('backbone.marionette'),
    UserModel = require('../models/user'),
    EpisodesView = require('./episodes'),
    EpisodesCollection = require('../collections/episodes'),
applyDifficulty = function(lexica) {
  var origUrl = Backbone.history.fragment;
  // alert(origUrl);
  var firstSlash = origUrl.indexOf('/');
  var theme = origUrl.slice(origUrl.indexOf('/', firstSlash + 1) + 1);
  var newUrl = origUrl.slice(0, firstSlash + 1) + lexica + '/' + theme;

  window.App.router.navigate(newUrl, true);
};

module.exports = DifficultyView = Marionette.ItemView.extend({

    model: UserModel,

    template: require('../../templates/difficulty.hbs'),

    difficulties: [
        'General',
        'Business English',
        'For TOEFL',
        'For GMAT',
        'For GRE',
        'Irregular verbs',
    ],
    difficulties_links: [
    'general',
    'business',
    'toefl',
    'gmat',
    'gre',
    'irregular',
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
        applyDifficulty(this.difficulties_links[this.difficulties.indexOf(this.model.get('difficulty'))]);
    },

    harder: function(el) {
        if (this.difficulties.indexOf(this.model.get('difficulty')) + 1 === this.difficulties.length) return;

        var difficulty = this.difficulties[this.difficulties.indexOf(this.model.get('difficulty')) + 1];

        this.model.save({ difficulty: difficulty });
        applyDifficulty(this.difficulties_links[this.difficulties.indexOf(this.model.get('difficulty'))]);
    }

});
