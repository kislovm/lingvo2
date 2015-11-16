var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    urlRoot: 'user',
    defaults: {
        difficulty: 'General',
        highlight: false,
        language: 'chinese'
    }
});
