
var i18n = require('i18next');
var Handlebars = require('hbsfy/runtime');

Handlebars.registerHelper('i18n', function (key) {
    return i18n.t(key);
});

var XHR = require('i18next-xhr-backend');
var languageDetector = require('i18next-browser-languagedetector');

var options = {
    lngs: ['en', 'ru-RU'],
    resGetPath: 'locale/i18n/__lng__/__ns__.json',
    debug: true,
    backend: {
        loadPath: 'locale/i18n/{{lng}}/{{ns}}.json'
    }
};

i18n
    .use(languageDetector)
    .use(XHR)
    .init(options, function() {
        var App = require('./app');
        var myapp = new App();
        myapp.start();
    });
