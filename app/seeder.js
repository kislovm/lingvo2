var feedUrls = require('../seeder/feedurls.js');
var models = require('./models');
var Request = require('request');
var FeedParser = require('feedparser');
var sanitizeHtml = require('sanitize-html');
var cheerio = require('cheerio');

var parseRssCnnCom = function($) {
      return $('div').filter('[class~=\'zn-body__paragraph\']')
      .map(function() {
          var text = $(this).text();
          return text
      }).get().join('</br>');
    },
    parseTechcrunch = function($)
    {
      var paragraphs = $('.article-entry.text p')
      .map(function(i, e) {
        return $(e).text();
      }).get();

      return paragraphs.join('</br>');
    },
    parseBbcCoUk = function ($) {
      var paragraphs = $('div[class~=\'story-body\']')
      .find('p:not([class])')
      .map(function(i, e) {
        return $(e).text();
      }).get();

      return paragraphs.join('</br>');
    },
    economistComParse = function($) {
      var paragraphs = $('div[class~=\'main-content\']')
          .find('p:not([class])')
          .map(function(i, e) {
            return $(e).text();
          }).get();
      return paragraphs.join('</br>');
    },
    parseRssfeedsUsatodayCom = function($) {
      var paragraphs = [];

      $('p:not([class])').each(function(i, e) {
        if($(e).parent().get(0).parent.name == 'article') {
          paragraphs.push($(e).text());
        }
      });
      return paragraphs.join('</br>');
    },
    parseWwwForbesComParse = function($) {
      var fbs_settings = {};
      eval($('script').eq(1).html());
      if(!fbs_settings.content) {
        console.log($.html());
      } else {
        return $(fbs_settings.content.body).text();
      }
    },
    parseTelegraphFeedsportalCom = function($) {
      return $('div[id~=\'mainBodyArea\']')
      .find('p:not([class]), h3')
      .map(function(i, e) {
        return $(e).text();
      }).get().join('</br>');
    },
    decodeHtmlEntity = function(str) {
      str = str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
      return str.replace(/&(\w+);/g, '');
    },
    parseFeedProxyGoogleCom = function($) {
      var paragraphs = $('div[class~=\'article-entry\']')
      .find('p:not([class])')
      .map(function(i, e) {
        return $(e).text();
      }).get();

      return decodeHtmlEntity(paragraphs.join('</br>')).trim();
    },
    parseHandlers = {'rss.cnn.com': parseRssCnnCom, 'www.bbc.co.uk': parseBbcCoUk,
                     'www.economist.com': economistComParse, 'rssfeeds.usatoday.com': parseRssfeedsUsatodayCom,
                     'www.forbes.com': parseWwwForbesComParse, 'telegraph.feedsportal.com': parseTelegraphFeedsportalCom,
                     'feedproxy.google.com': parseFeedProxyGoogleCom},
    getDomain = function(url) {
      var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      return matches && matches[1];
    },
    extractArticleBody = function(url, $) {
      var domain = getDomain(url);
      if (!(domain in parseHandlers)) {
        console.log('ERROR: unkown domain [' + domain + ']');
        return;
      }
      return parseHandlers[domain]($);
    },
    originalArticleLinks = {'rss.cnn.com': 'cnn.com', 'www.bbc.co.uk': 'bbc.com', 'www.economist.com': 'economist.com',
                            'rssfeeds.usatoday.com': 'usatoday.com', 'www.forbes.com': 'forbes.com',
                            'telegraph.feedsportal.com':'telegraph.co.uk', 'feedproxy.google.com': 'techcrunch.com'},
    getOriginalArticleLink = function(url) {
      var domain = getDomain(url);
      if (!(domain in originalArticleLinks)) {
        console.log('ERROR: unkown domain [' + domain + ']');
        return;
      }
      return originalArticleLinks[domain];
    };

module.exports = {
  check: function() {
    try {
      for (var key in feedUrls) {

        feedUrls[key].forEach(function(feed) {
          var _key = key;
            var options = {
                url: feed.url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
                }
            };

          var request = Request(options),
              feedparser = new FeedParser();

          request.on('response', function(res) {
            var stream = this;

            if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

            stream.pipe(feedparser);
          }).on('error',function(e){
            console.log('Error: ' + key + '\n' + e.message);
          });

          // Handle HTTP errors
          feedparser.on('error', function(error) {
            console.log('http error while parsing rss ' + error);
          })

          // Every time a readable chunk arrives, add it to the episodes array
          .on('readable', function() {
            var stream = this, item;
            while (item = stream.read()) {

              var image;
              var description = (item.summary.length > item.description.length ?
                item.summary : item.description) || item.meta.description;
              var ep = {
                  name: feed.name,
                  title: item.title,
                  link: item.link,
                  publicationDate: new Date(item.pubDate),
                  category: _key
              };

                ep.description = sanitizeHtml(description, {
                  allowedTags: [],
                  transformTags: {
                    'img': function(tagName, attribs) {
                        if (!image && attribs.src.indexOf('jpg') !== -1 &&
                          attribs.src.indexOf('videos.usatoday.net') === -1) {
                            image = attribs.src;
                        }
                        return {};
                      }
                    }
                  });

                if(image) {
                    ep.image = image
                }

                  if (!description || description.length < 150) continue;

                  if (ep.description.indexOf('...') === ep.description.length - 3) {
                      ep.description = ep.description.slice(0, -3);
                  }

                  Request({
                      url: ep.link,
                          headers: {
                              'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
                          }
                    }, function(err, res,body){
                    if(err) {
                      console.log(err);
                    } else{
                      var $ = cheerio.load(body);
                      ep.body = extractArticleBody(ep.link, $);
                      if(getDomain(ep.link) == 'feedproxy.google.com') {
                        ep.description = ep.description.slice(0, -19);
                      }
                      ep.originalArticleLink = getOriginalArticleLink(ep.link);
                    }

                    models.Episode.findOne({ title: ep.title}, function(err, episode) {
                      if (!err) {
                        if (!episode) {
                          episode = new models.Episode(ep);

                          episode.save(function(err) {
                            if (!err) {
                              console.log('Inserted episode with category ' +
                              ep.category +
                              ' and title ' +
                              ep.title);
                            }
                          });
                        } else if(!episode.body) {
                            episode.body = ep.body;
                            episode.save();
                        }
                      }
                    });

                  });



                }
              }).on('end', function() {

              });
            });
          }
        } catch(e) {}
      }
    };
