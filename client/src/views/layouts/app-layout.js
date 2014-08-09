var Marionette = require('backbone.marionette');

module.exports = AppLayoutView = Backbone.Marionette.Layout.extend({
    template: require('../../../templates/layout.hbs'),

    el: '.content',

    regions: {
        menu: '.themes-list-holder',
        content: '.recs-holder',
        popup: '.popup-body'
    }
});

