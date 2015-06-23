var dict = require('./translator/dict');

var newDict = {};

Object.keys(dict).forEach(function(key) {
    newDict[key.toLowerCase()] = dict[key];
});

console.log('module.exports = ', JSON.stringify(newDict));