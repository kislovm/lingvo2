var models = require('../app/models');

module.exports = {
    index: function(req, res) {

        var stat = {},
            episodesByDate = {},
            episodesByDateArray = [],
            episodesByMonth = {},
            episodesByMonthArray = [];

        stat.articlesCount = models.Episode.find({ lexica: 'general' }, function(err, episodes) {

                episodes.forEach(function(episode) {
                    if(!episode.publicationDate) return;

                    var date = episode.publicationDate,
                        dateField = [date.getUTCDate(), date.getMonth(), date.getFullYear()].join('.'),
                        monthField = [date.getMonth(), date.getFullYear()].join('.');

                    episodesByDate[dateField] =
                        episodesByDate[dateField] ?
                            episodesByDate[dateField] + 1 :
                            1;

                    episodesByMonth[monthField] =
                        episodesByMonth[monthField] ?
                            episodesByMonth[monthField] + 1 :
                            1;

                });

                for(var key in episodesByDate) {
                    episodesByDateArray.push({ date: key, count: episodesByDate[key] })
                }

                for(var key in episodesByMonth) {
                    episodesByMonthArray.push({ date: key, count: episodesByMonth[key] })
                }

                res.render('statistics', {
                    articlesCount: episodes.length,
                    episodesByDateArray: episodesByDateArray,
                    episodesByMonthArray: episodesByMonthArray
                });
        });



    }
};
