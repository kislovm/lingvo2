var Marionette = require('backbone.marionette');

module.exports = AppLayoutView = Marionette.LayoutView.extend({

    el: '.content-holder',

    regions: {
        content: '.center-content'
    }
});

