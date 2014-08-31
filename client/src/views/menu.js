var Marionette = require('backbone.marionette');

module.exports = MenuView = Marionette.ItemView.extend({

    template: require('../../templates/menu.hbs'),

    initialize: function() {
        this.listenTo(App.router, 'route', this.selectActive);
    },

    selectActive: function() {
        //ОЛОЛО БЫДЛОКОД

        $('.topic-link').removeClass('selected');
        $('.mobile-navigation > a').removeClass('selected');
        $('a[href="' + (window.location.hash || '#') + '"] > .topic-link').addClass('selected');
        $('.mobile-navigation > a[href="' + (window.location.hash || '#') + '"]').addClass('selected');
    }

});
