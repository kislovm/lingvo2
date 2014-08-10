var models = require('./models'), Request = require('request'), FeedParser = require('feedparser');

module.exports = {
    check: function() {

        models.Episode.remove().exec();

        models.Episode.find({}, function(err, contacts) {


            var feedUrls = {
                politics: [
                    'http://rss.cnn.com/rss/cnn_allpolitics.rss', 'http://feeds.bbci.co.uk/news/politics/rss.xml'
                ],
                social: [
                    'http://rss.cnn.com/rss/cnn_allpolitics.rss'
                ],
                economics: [
                    'http://www.economist.com/feeds/print-sections/79/finance-and-economics.xml',
                    'http://feeds.bbci.co.uk/news/business/economy/rss.xml',
                    'http://content.usatoday.com/marketing/rss/rsstrans.aspx?feedId=money1',
                    'http://www.forbes.com/markets/index.xml'
                ],
                world: [
                    'http://rss.cnn.com/rss/edition_world.rss',
                    'http://feeds.bbci.co.uk/news/world/rss.xml',
                    'http://content.usatoday.com/marketing/rss/rsstrans.aspx?feedId=news4'
                ],
                sport: [
                    'http://rss.cnn.com/rss/edition_sport.rss',
                    'http://content.usatoday.com/marketing/rss/rsstrans.aspx?feedId=sports1',
                    'http://www.forbes.com/sportsmoney/index.xml'
                ],
                tech: [
                    'http://rss.cnn.com/rss/edition_technology.rss',
                    'http://rssfeeds.usatoday.com/usatoday-TechTopStories',
                    'http://www.forbes.com/technology/index.xml '
                ],
                science: [
                    'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml?edition=uk'
                ],
                culture: [
                    'http://www.telegraph.co.uk/culture/tvandradio/bbc/rss'
                ]
            };

            for (var key in feedUrls) {
                var feedMeta;

                // Get the feed by URL
                feedUrls[key].forEach(function(feedUrl) {
                    var _key = key;

                    var request = Request(feedUrl), feedparser = new FeedParser();

                    request.on('response', function(res) {
                        var stream = this;

                        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

                        stream.pipe(feedparser);
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
                                //console.log(item.enclosures[0].url);
                                var ep = {
                                    title: item.title,
                                    link: item.link,
                                    image: item.enclosures[0].url,
                                    description: item.description,
                                    publicationDate: item.pubDate,
                                    category: _key
                                };

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

                            }
                        }).on('end', function() {
                            console.log('successfully updated rss');
                        });
                });
            }
        });
    }
};
