var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('./app/models').User;
var Dictionary = require('./app/models').Dictionary;

module.exports = {
    facebook: new FacebookStrategy({
        clientID: '109742002694234',
        clientSecret: 'c32d39b4bc019785d4eba3a458a248cc',
        callbackURL: '/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        var u;

        User.findOne({ oauthID: profile.id }).exec()
            .then(function(user) {
                if (user != null) {
                    done(null, user);
                }
                else {
                    return (new User({
                        oauthID: profile.id,
                        name: profile.displayName,
                        created: Date.now()
                    })).save();
                }
            })
            .then(function(user) {
                u = user;
                return (new Dictionary({
                    name: 'Main',
                    user: user.id,
                    created: Date.now() }))
                    .save();
            })
            .then(function(dictionary) {
                u.selected = dictionary._id;
                return u.save();
            })
            .then(function() { done(null, user) });
    }),
    twitter: new TwitterStrategy({
        consumerKey: 'N9B2OdY4aSrY4TIJYEs6E6DtF',
        consumerSecret: 'NMgjGYqcXEBeC8nI3VobnYfrHfLDNfTcq7Wl1tDmwqDgP5H06U',
        callbackURL: '/auth/twitter/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ oauthID: profile.id }).exec()
            .then(function(user) {
                if (user != null) {
                    done(null, user);
                }
                else {
                    return (new User({
                        oauthID: profile.id,
                        name: profile.displayName,
                        created: Date.now()
                    })).save();
                }
            })
            .then(function(user) {
                (new Dictionary({
                    name: 'Main',
                    user: user.id,
                    created: Date.now() }))
                    .save()
                    .then(function() { done(null, user) });
            });
    })
};
