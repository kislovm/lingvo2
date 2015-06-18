var Marionette = require('backbone.marionette');

module.exports = AppLayoutView = Marionette.LayoutView.extend({

    el: '.content-holder',

    regions: {
        menu: '.menu',
        content: '.articles',
        difficulty: '.language-lvl-selector',
        popup: '.popup-body',
        auth: '.auth'
    }
});

