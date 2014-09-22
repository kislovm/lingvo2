var models = require('./models'),
    Request = require('request'),
    FeedParser = require('feedparser'),
    sanitizeHtml = require('sanitize-html');

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
                       console.log("Error: " + key + "\n" + e.message);
                       console.log( e.stack );
                    });

                    // Handle HTTP errors
                    feedparser.on('error', function(error) {
                        console.log('http error while parsing rss');
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

                                models.Episode.findOne({ title: ep.title}, function(err, episode) {
                                    if (!err) {
                                        if (!episode) {
                                            episode = new models.Episode(ep);

                                            episode.save(function(err) {
                                                if (!err) {
                                                    //                                                    console.log('Inserted episode with category ' +
                                                    //                                                        ep.category +
                                                    //                                                        ' and title ' +
                                                    //                                                        ep.title);
                                                }
                                            });
                                        }
                                    }
                                });

                            }
                        }).on('end', function() {
                            console.log('successfully updated rss');
                        });
                });
            }
        } catch(e) {}
    }
};
