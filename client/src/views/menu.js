var $ = require('jquery');
require('malihu-custom-scrollbar-plugin')($);
var Marionette = require('backbone.marionette');

module.exports = Marionette.ItemView.extend({

    template: false,

    initialize: function() {
        this.$el.scroll(this.onScroll);
        this.$el.mCustomScrollbar({
            axis: 'x',
            theme: 'minimal-dark'
        });
        this.listenTo(App.router, 'route', this.selectActive);
        this.selectActive();
    },

    onScroll: function() {
        if(!this.isSent) {
            window.yaCounter.reachGoal('category-scroll');
            this.isSent = true;
        }
    },

    selectActive: function() {
        //ОЛОЛО БЫДЛОКОД

        $('.menu a').removeClass('active');
        $('a[href="' + (window.location.hash || '#') + '"]').addClass('active');
    }

});
