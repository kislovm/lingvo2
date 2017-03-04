
var Marionette = require('backbone.marionette');
var DictionaryView = require('./dictionary');
var $ = require('jquery');

module.exports = Marionette.View.extend({

    className: 'dictionaries-holder',

    template: require('../../templates/dictionary-section.hbs'),

    initialize: function() {
        this.model = App.data.user;
        var lang = this.model.get('language');
    },

    events: {
        'change .autosave-slider': 'autosaveChange',
        'change .highlight-slider': 'highlightChange',
        'click .settings-link': 'openSettings',
        'change .sorting-block-select': 'changeSort',
        'click .sorting-block-select': 'clickSort',
        'click .dict-title-close': 'close',
        'click .word-cancel': 'cancel',
        'click .word-delete': 'delete',
        'click .dict-checkbox': 'viewBlock'
    },

    cancel: function() {
        this.dictionaryView.cancel();
    },

    delete: function() {
        this.dictionaryView.delete();
    },

    close: function() {
        App.core.vent.trigger('dictionary:close');
    },

    clickSort: function() {
        yaCounter.reachGoal('click-sort');
    },
    viewBlock: function() {
        if ($('.dict-checkbox:checked').val()) {
            $(".b-dictionaries-block__button").css("display", "block");
        } else {
            $(".b-dictionaries-block__button").css("display", "none");
        }
    },

    changeSort: function() {
        var sortByTime = this.$el.find('.sorting-block-select:checked').val() === 'time';
        this.dictionaryView.setSortByTime(sortByTime);
    },

    openSettings: function() {
        yaCounter.reachGoal('setting-click');
        $('body').addClass('popup');
    },

    notRegistred: function(e) {
        e.preventDefault();
        alert('Пожалуйста, зарегистрируйтесь');
    },

    autosaveChange: function(e) {
        yaCounter.reachGoal('autosave-click');
        this.model.set('autosave', e.currentTarget.checked);
        this.model.save();
    },

    highlightChange: function(e) {
        this.model.set('autosave', e.currentTarget.checked);
        this.model.save();
    },

    onRender: function() {
        this.dictionaryView = new DictionaryView({
            el: this.$el.find('.dictionaries-block-words-js'),
            model: App.data.user
        });
    }
});
