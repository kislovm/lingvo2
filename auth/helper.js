var Stat = require('../stat/controller');
var EmailController = require('../email/controller');

var User = require('../app/models').User;
var Dictionary = require('../app/models').Dictionary;

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
        .then(sendEmailForUser)
        .then(Stat.log.registration);
};

module.exports = createUser;
