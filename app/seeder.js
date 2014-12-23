String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
// var $ = require('jquery')(require('jsdom').jsdom().parentWindow);

var models = require('./models'),
Request = require('request'),
FeedParser = require('feedparser'),
sanitizeHtml = require('sanitize-html'),
cheerio = require('cheerio'),
jQuery = require('jquery'),
// replaceParenthese = function(str) {
//   return str.replace(/\(/, '\\(').replace(/\)/, '\\)').replace(/\[/, '\\[').replace(/\]/, '\\]')
// },
parseRssCnnCom = function($, desc) {
  return $('p').filter('[class~=\'cnn_storypgraphtxt\']')
  .map(function() {
    return $(this).text();
  }).get().join('\n');
},
parseBbcCoUk = function ($, desc) {
  return $('div[class~=\'story-body\']')
  .find('p:not([class])')
  .map(function(i, e) {
    return $(e).text();
  }).get().join('\n');
},
economist_com_parse = function($, desc) {
  var paragraphs = $('div[class~=\'main-content\']')
  .find('p:not([class])')
  .map(function(i, e) {
    return $(e).text();
  }).get();
  article = paragraphs.join('\n\n').trim();
  desc = desc.trim().slice(0, -3).slice(-10);

  desc_begin = article.lastIndexOf(desc);
  if (desc_begin != -1) {
    desc_end = desc_begin + 10;
    return article.slice(desc_end);
  }

  return article;
},
parseRssfeedsUsatodayCom = function($, desc) {
  var paragraphs = [];
  // $('article[class~='asset story clearfix']')
  $('p:not([class])').each(function(i, e) {
    if($(e).parent().get(0).parent.name == 'article') {
      paragraphs.push($(e).text());
    }
  });
  return paragraphs.join('\n\n');
},
parseWwwForbesComParse = function($, desc) {
  var paragraphs = $('div[class~=\'body_inner\']')
  .find('p:not([class])')
  .map(function(i, e) {
    return $(e).text();
  }).get();

  article = paragraphs.join('\n\n').trim();
  desc = desc.trim().slice(-10);

  desc_begin = article.lastIndexOf(desc);
  if (desc_begin != -1) {
    desc_end = desc_begin + 10;
    return article.slice(desc_end);
  }

  return article;
},
parseTelegraphFeedsportalCom = function($, desc) {
  return $('div[id~=\'mainBodyArea\']')
  .find('p:not([class]), h3')
  .map(function(i, e) {
    return $(e).text();
  }).get().join('\n');
},
parseFeedProxyGoogleCom = function($, desc) {
  var paragraphs = $('div[class~=\'article-entry\']')
  .find('p:not([class])')
  .map(function(i, e) {
    return $(e).text();
  }).get();

  article = paragraphs.join('\n\n');
  desc = desc.trim().slice(-20, -10);
  desc_begin = article.lastIndexOf(desc);
  if(desc_begin != -1) {
    desc_end = desc_begin + 20;
    return article.slice(desc_end);
  }
  return article;
},
parseHandlers = {'rss.cnn.com': parseRssCnnCom, 'www.bbc.co.uk': parseBbcCoUk,
'www.economist.com': economist_com_parse, 'rssfeeds.usatoday.com': parseRssfeedsUsatodayCom,
'www.forbes.com': parseWwwForbesComParse, 'telegraph.feedsportal.com': parseTelegraphFeedsportalCom,
'feedproxy.google.com': parseFeedProxyGoogleCom},
getDomain = function(url) {
  var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  return matches && matches[1];
},
extractArticleBody = function(url, $, desc) {
  var domain = getDomain(url);
  if (!(domain in parseHandlers)) {
    console.log('ERROR: unkown domain [' + domain + ']');
    return;
  }
  return parseHandlers[domain]($, desc);
},
originalArticleLinks = {'rss.cnn.com': 'cnn.com', 'www.bbc.co.uk': 'bbc.com', 'www.economist.com': 'economist.com',
                        'rssfeeds.usatoday.com': 'usatoday.com', 'www.forbes.com': 'forbes.com',
                        'telegraph.feedsportal.com':'telegraph.co.uk', 'feedproxy.google.com': 'techcrunch.com'},
getOriginalArticleLink = function(link) {
  var domain = getDomain(url);
  if (!(domain in parseHandlers)) {
    console.log('ERROR: unkown domain [' + domain + ']');
    return;
  }
  return originalArticleLinks[domain];
}

module.exports = {
  check: function() {
    try {
      //        models.Episode.remove().exec();

      var feedUrls = {
        politics: [
        {
          url: 'http://rss.cnn.com/rss/cnn_allpolitics.rss',
          name: 'CNN'
        },
        {
          url: 'http://feeds.bbci.co.uk/news/politics/rss.xml',
          name: 'BBC'
        }
        ],
        social: [
        {
          url: 'http://rss.cnn.com/rss/cnn_allpolitics.rss',
          name: 'CNN'
        }
        ],
        economics: [
        {
          url: 'http://www.economist.com/feeds/print-sections/79/finance-and-economics.xml',
          name: 'Economist'
        },
        {
          url: 'http://feeds.bbci.co.uk/news/business/economy/rss.xml',
          name: 'BBC'
        },
        {
          url: 'http://content.usatoday.com/marketing/rss/rsstrans.aspx?feedId=money1',
          name: 'USATODAY'
        },
        {
          url: 'http://www.forbes.com/markets/index.xml',
          name: 'Forbes'
        }
        ],
        world: [
        {
          url: 'http://rss.cnn.com/rss/edition_world.rss',
          name: 'CNN'
        },
        {
          url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
          name: 'BBC'
        },
        {
          url: 'http://content.usatoday.com/marketing/rss/rsstrans.aspx?feedId=news4',
          name: 'USATODAY'
        }
        ],
        sport: [
        {
          url: 'http://rss.cnn.com/rss/edition_sport.rss',
          name: 'CNN'
        },
        {
          url: 'http://content.usatoday.com/marketing/rss/rsstrans.aspx?feedId=sports1',
          name: 'USATODAY'
        },
        {
          url: 'http://www.forbes.com/sportsmoney/index.xml',
          name: 'Forbes'
        }
        ],
        tech: [
        {
          url: 'http://feeds.feedburner.com/TechCrunch/',
          name: 'Techcrunch'
        },
        {
          url: 'http://rss.cnn.com/rss/edition_technology.rss',
          name: 'CNN'
        },
        {
          url: 'http://rssfeeds.usatoday.com/usatoday-TechTopStories',
          name: 'USATODAY'
        },
        {
          url: 'http://www.forbes.com/technology/index.xml',
          name: 'Forbes'
        }
        ],
        science: [
        {
          url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml?edition=uk',
          name: 'BBC'
        }
        ],
        culture: [
        {
          url: 'http://www.telegraph.co.uk/culture/tvandradio/bbc/rss',
          name: 'Telegraph'
        }
        ]
      };

      for (var key in feedUrls) {
        var feedMeta;

        // Get the feed by URL
        feedUrls[key].forEach(function(feed) {
          var _key = key;

          var request = Request(feed.url), feedparser = new FeedParser();

          request.on('response', function(res) {
            var stream = this;

            if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

            stream.pipe(feedparser);
          }).on('error',function(e){
            console.log('Error: ' + key + '\n' + e.message);
            console.log( e.stack );
          });

          // Handle HTTP errors
          feedparser.on('error', function(error) {
            console.log('http error while parsing rss ' + error);
            console.log( error.stack );
          })

          // Store the feed's metadata
          .on('meta', function(meta) {
            feedMeta = meta;
          })

          // Every time a readable chunk arrives, add it to the episodes array
          .on('readable', function() {
            var stream = this, item;
            while (item = stream.read()) {
              //item.title == 'The best quotes' && console.log(item);


              var image, description = (item.summary.length >
                item.description.length ?
                item.summary :
                item.description) || item.meta.description, ep = {
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

                      if (!image &&
                        attribs.src.indexOf('jpg') !=
                        -1 &&
                        attribs.src.indexOf('videos.usatoday.net') ==
                        -1)
                        image = attribs.src;


                        return {};
                      }
                    }
                  });

                  image && (ep.image = image);

                  if (!description || description.length < 150) continue;

                  Request(ep.link, function(err, res, body){
                    article = ''
                    if(err) {
                      console.log(err);
                    } else{
                      $ = cheerio.load(body);
                      ep.body = extractArticleBody(ep.link, $, ep.description);
                      ep.originalArticleLink = getOriginalArticleLink(ep.link);
                    }

                    // console.log('[link]: ' + ep.link);
                    // console.log('[desc]: [' + ep.description + ']');
                    // console.log('[article]: [' + ep.body + ']');

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
                        }
                      }
                    });

                  });



                }
              }).on('end', function() {
                var arr = [];

                models.Episode.find({}, function(err, episodes) {
                  episodes.forEach(function(episode) {
                    if(arr.indexOf(episode.title) != -1) { console.log('removed double ' +episode.title); episode.remove() };
                    arr.push(episode.title);
                  });
                });
              });
            });
          }
        } catch(e) {}
      }
    };
