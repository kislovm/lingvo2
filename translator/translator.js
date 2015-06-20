var Promise = require('es6-promise').Promise;
var request = require('request');

var translatorDict = require('./dict');
 
module.exports = function () {
    this.translate = function(from, to, what) {
        return new Promise(function(resolve, reject) {
            from !== 'en' && reject(Error("Translation from en only, have: " + from));
            langs.indexOf(to) === -1 && reject(Error("Translation to [" + langs + "] only, have: " + to));
 
            var url = 'https://glosbe.com/gapi/translate?from=' + from + '&dest=' + to + '&format=json&phrase=' + what.toLowerCase() + '&pretty=true';
            request.get(url, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  var body = JSON.parse(body)['tuc'];
                  
                  if (!body || body.length === 0) {
                      resolve({'phrase': what, 'transcription': translatorDict[what], 'translations': []});
                  } else {
                      var phrases = body.filter(function(v) { return 'phrase' in v;})
                                        .map(function(v) { return v['phrase']});
                      resolve({'phrase': what, 'transcription': translatorDict[what], 'translations': phrases});
                  }
              } else {
                  reject(Error('[' + error + '] status code: ' + response.statusCode));
              }
             });
        });
    };
 
    this.languages = function() {
        return {
            chinese: {
                 'shortcut' : 'zh'
            },
            arabic: {
                'shortcut' : 'ar'
            },
            portuguese: {
                'shortcut' : 'pt'
            },
            russian: {
                'shortcut' : 'ru'
            },
            spanish: {
                'shortcut' : 'es'
            },
            turkish: {
                'shortcut' : 'tr'
            }
        }
    };

    var langs = Object.keys(this.languages()).map(function(l) { return this.languages()[l]['shortcut']; }, this);
};

//
//var t = new Translator();
//t.languages();
//
//t.translate('en', 'ar', 'works').then(function(t) {
//    console.log(t);
//}, function(err){
//    console.log('Error: ' + err);
//});
