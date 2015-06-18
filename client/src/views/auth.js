var Marionette = require('backbone.marionette');
var Popup = require('modui-popup');
var DictionaryPopup = require('./dictionary-popup');

module.exports = Marionette.ItemView.extend({

    el: '.auth',

    template: false,

    events: {
        'click .dictionary-popup': 'showDictionaryPopup'
    },

    showDictionaryPopup: function() {
        Popup.open({
            target : this.$el.find('.dictionary-popup'),
            position : 'bottom center',
            contents : new DictionaryPopup({ model: App.data.dictModel })
        });
    }

});