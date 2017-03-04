var Marionette = require('backbone.marionette');
var $ = require('jquery');

module.exports = Marionette.View.extend({

    template: require('../../templates/word-popup.hbs'),

    events: {
        'click .word__save': '_save'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        if (App.data.user.get('autosave')) {
            this._save();
        }
    },

    _save: function(e) {
        if(e) {
            yaCounter.reachGoal('save-word');
        }
        if(App.data.user.get('registred')) {
            $.post('/dictionary/add/word', this.model.toJSON(), 'json')
                .success(function () {
                    alert('Word saved to dictionary');
                    App.core.vent.trigger('dict:update');
                });
        } else {
            alert('Please login to save all your words to personal dictionary');
        }
    }

});
