var Marionette = require('backbone.marionette');

module.exports = MenuView = Marionette.ItemView.extend({

    template: require('../../templates/menu.hbs'),

    initialize: function() {
        this.listenTo(App.router, 'route', this.selectActive);
    },

    selectActive: function() {
        $('.topic-link').removeClass('selected');
        $('a[href="' + window.location.hash + '"] > .topic-link').addClass('selected');
    }

});
