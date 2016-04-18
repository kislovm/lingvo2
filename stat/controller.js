var StatAction = require('../app/models').Statistic;

var registration = function() {
    return new StatAction({ action: 'registration' }).save();
};

var login = function() {
    return new StatAction({ action: 'login' }).save();
};

var forgotPassword = function() {
    return new StatAction({ action: 'forgot-password' }).save();
};

var logout = function() {
    return new StatAction({ action: 'logout' }).save();
};

module.exports = {
    log: {
        registration: registration,
        login: login,
        forgotPassword: forgotPassword,
        logout: logout
    }
};
