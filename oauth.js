var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var EmailController = require('./email/controller');

var User = require('./app/models').User;
var Dictionary = require('./app/models').Dictionary;

var createDictionaryForUser = function(user) {
    return new Dictionary({
        name: 'Main',
        user: user.id,
        created: Date.now() })
        .save()
        .then(function(dictionary) {
            return Dictionary.findOne(dictionary).populate('user').exec();
        }, function(rejection) {
            console.log('/n', rejection);
        });
};

var saveDictionaryForUser = function(dictionary) {
    var user = dictionary.user;
    user.selected = dictionary._id;
    return user.save();
};

var sendEmailForUser = function(user) {
    if(user.username) {
        EmailController.sendRegistrationEmail(user.username);
    }

    return user;
};

var createUser = function(profile, username, password) {
    var user = {
        created: Date.now()
    };

    if(profile) {
        user.oauthID = profile.id;
        user.name = profile.displayName;
    }

    if(username) {
        user.username = username;
        user.password = password;
    }

    return new User(user).save()
        .then(createDictionaryForUser)
        .then(saveDictionaryForUser)
        .then(sendEmailForUser);
};

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
                    return createUser(profile);
                }
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
                    return createUser(profile);
                }
            });
    }),
    email: new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username: username }).exec()
                .then(function (user) {
                    if (!user) { return createUser(null, username, password); }
                    if (!user.verifyPassword(password)) { return false; }
                    return user;
                }, function(error) {
                    return done(error);
                })
                .then(function(user) {
                    return done(null, user)
                });
        }
    )
};
