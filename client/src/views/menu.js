var $ = require('jquery');
var Marionette = require('backbone.marionette');

module.exports = Marionette.ItemView.extend({

    template: false,

    initialize: function() {
        this.$el.scroll(this.onScroll);
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
