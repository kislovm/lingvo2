var Marionette = require('backbone.marionette');
var $ = require('jquery');

module.exports = Marionette.ItemView.extend({

    template: require('../../templates/word-popup.hbs'),

    events: {
        'click .word__save': '_save'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        if (App.data.dictModel.get('autosave')) {
            this._save();
        }
    },

    _save: function() {
        $.post('/dictionary/add/word', this.model.toJSON(), 'json')
            .success(function() {
                alert('Word saved to dictionary ' + App.data.dictModel.get('selected'));
            });
    }

});