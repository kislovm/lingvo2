var Marionette = require('backbone.marionette');

module.exports = AppLayoutView = Marionette.LayoutView.extend({
    template: require('../../../templates/layout.hbs'),

    el: '.content-holder',

    regions: {
        menu: '.menu',
        content: '.articles',
        difficulty: '.language-lvl-selector',
        popup: '.popup-body'
    }
});

