var Marionette = require('backbone.marionette');

module.exports = Marionette.LayoutView.extend({

    template: require('../../templates/dictionary-section.hbs'),

    events: {
        'change .autosave-slider': 'autosaveChange',
        'change .highlight-slider': 'highlightSlider'
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
