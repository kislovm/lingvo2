var Backbone = require('backbone'),
    DictionaryModel = require('../models/dictionary');

module.exports = DictionaryCollection = Backbone.Collection.extend({
    model:  DictionaryModel,

    url: '/dictionary/'

});
