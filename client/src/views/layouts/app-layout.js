var Marionette = require('backbone.marionette');

module.exports = AppLayoutView = Backbone.Marionette.Layout.extend({
    template: require('../../../templates/layout.hbs'),

    el: '.content',

    regions: {
        content: '.js-boilerplate-app'
    }
});

