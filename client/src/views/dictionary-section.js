var Marionette = require('backbone.marionette');
var DictionaryView = require('./dictionary');
var $ = require('jquery');

module.exports = Marionette.ItemView.extend({

    className: 'dictionaries-holder',

    template: require('../../templates/dictionary-section.hbs'),

    initialize: function() {
        this.model = App.data.user;
    },

    events: {
        'change .autosave-slider': 'autosaveChange',
        'change .highlight-slider': 'highlightChange',
        'click .settings-link': 'openSettings',
        'change .sorting-block-select': 'changeSort',
        'click .sorting-block-select': 'clickSort',
        'click .dict-title-close': 'close'
    },

    close: function() {
        App.core.vent.trigger('dictionary:close');
    },

    clickSort: function() {
        yaCounter.reachGoal('click-sort');
    },

    changeSort: function() {
        var sortByTime = this.$el.find('.sorting-block-select').val() === 'Time added';
        this.dictionaryView.setSortByTime(sortByTime);
    },

    openSettings: function() {
        yaCounter.reachGoal('setting-click');
        $('body').addClass('popup');
    },

    notRegistred: function(e)
    {
        e.preventDefault();
        alert('Пожалуйста, зарегистрируйтесь');
    },

    autosaveChange: function(e) {
        yaCounter.reachGoal('autosave-click');
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
