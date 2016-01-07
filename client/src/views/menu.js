var $ = require('jquery');
var Marionette = require('backbone.marionette');

module.exports = Marionette.ItemView.extend({

    template: false,

    initialize: function() {
        this.listenTo(App.router, 'route', this.selectActive);
        this.selectActive();
    },

    selectActive: function() {
        //ОЛОЛО БЫДЛОКОД

        $('.menu a').removeClass('active');
        $('a[href="' + (window.location.hash || '#') + '"]').addClass('active');
    }

});
