var Marionette = require('backbone.marionette');

var itemView = Marionette.ItemView.extend({
    template: require('../../templates/episode.hbs'),

    tagName: 'article',

    className: 'article',

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    }

});

module.exports = CollectionView = Marionette.CollectionView.extend({
    initialize: function() {
        this.listenTo(this.collection, 'change', this.render);
    },
    childView: itemView
});
