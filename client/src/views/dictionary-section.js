var Marionette = require('backbone.marionette');
var DictionaryView = require('./dictionary');
var $ = require('jquery');

module.exports = Marionette.ItemView.extend({

    className: 'dictionaries-holder',

    template: require('../../templates/dictionary-section.hbs'),

    initialize: function() {
        this.model = App.data.user;
    },

    events: function() {
        if(!App.data.user.get('registred')) {
            return {
                'click input': 'notRegistred',
                'click select': 'notRegistred',
                'click .settings-link': 'notRegistred',
                'change .sorting-block-select': 'changeSort'
            };
        } else {
            return {
                'change .autosave-slider': 'autosaveChange',
                'change .highlight-slider': 'highlightChange',
                'click .settings-link': 'openSettings',
                'change .sorting-block-select': 'changeSort'
            };
        }
    },

    changeSort: function() {
        var sortByTime = this.$el.find('.sorting-block-select').val() === 'Time added';
        this.dictionaryView.setSortByTime(sortByTime);
    },

    openSettings: function()
    {
        $('body').addClass('popup');
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

    onRender: function()
    {
        this.dictionaryView = new DictionaryView({
            el: this.$el.find('.dictionary-wrapper'),
            model: App.data.user
        });
    }
});
