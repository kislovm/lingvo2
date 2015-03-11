var Backbone = require('backbone');

module.exports = UserModel = Backbone.Model.extend({
    urlRoot: 'user',
    defaults: {
        difficulty: 'General',
        highlight: false,
        language: 'chinese'
    }
});
