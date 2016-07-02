var Marionette = require('backbone.marionette');

module.exports = Marionette.LayoutView.extend({

    el: '.content-holder',

    regions: {
        content: '.episodes-js',
        dictionaries: '.dictionaries-block-js',
        //tipOfTheDay: '.tip-of-the-day',
        settings: '.settings-js',
        //mobileFooter: '.showsettings-js',
        authorization: '.authorization-block-js'
    }
});
