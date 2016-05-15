var User = require('../app/models').User;
var createUser = require('./helper');

module.exports = new require('passport-vkontakte').Strategy({
        clientID: 5464545, // VK.com docs call it 'API ID'
        clientSecret: 'WKzyLR1YsQXuSpz2rLNq',
        callbackURL: '/auth/vk/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ oauthID: profile.id }).exec()
            .then(function(user) {
                if (user != null) {
                    Stat.log.login();
                    done(null, user);
                }
                else {
                    return createUser(profile);
                }
            })
            .then(function() {
                done(null, user)
            });
    }
);
