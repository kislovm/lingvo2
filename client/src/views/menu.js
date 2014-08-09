var Marionette = require('backbone.marionette');

module.exports = MenuView = Marionette.ItemView.extend({

    template: require('../../templates/menu.hbs'),

    initialize: function() {
        this.listenTo(App.router, 'route', this.selectActive);
    },

    selectActive: function() {
        this.$el.find('.theme-item').removeClass('selected');
        this.$el.find('a[href="' + window.location.hash + '"] > .theme-item').addClass('selected');
    }

});
