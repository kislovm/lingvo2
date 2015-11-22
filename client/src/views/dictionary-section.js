var Marionette = require('backbone.marionette');

module.exports = Marionette.LayoutView.extend({

    template: require('../../templates/dictionary-section.hbs'),

    events: function() {
        if(!App.data.user.get('registred')) {
            return {
                'click input': 'notRegistred',
                'click select': 'notRegistred'
            };
        } else {
            return {
                'change .autosave-slider': 'autosaveChange',
                'change .highlight-slider': 'highlightSlider'
            };
        }
    },

    notRegistred: function(e)
    {
        e.preventDefault();
        alert('Пожалуйста, зарегистрируйтесь');
    },

    autosaveChange: function(e)
    {
        this.model.set('autosave', e.currentTarget.checked);
        this.model.save();
    },

    highlightChange: function(e)
    {
        this.model.set('autosave', e.currentTarget.checked);
        this.model.save();
    },

    initialize: function() {
        this.model = App.data.user;
    }
});
