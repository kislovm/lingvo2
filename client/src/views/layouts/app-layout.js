var Marionette = require('backbone.marionette');

module.exports = Marionette.LayoutView.extend({

    el: '.content-holder',

    regions: {
        content: '.center-content',
        dictionaries: '.dictionaries-section',
        tipOfTheDay: '.tip-of-the-day',
        settings: '.functions-language'
    }
});

