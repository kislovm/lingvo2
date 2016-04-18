var User = require('../app/models').User;
var mail = require('../email/controller');

var Stat = require('../stat/controller');

module.exports = {
    redirect: function(req, res) {
        res.redirect('/#');
    },

    logout: function(req, res) {
        Stat.log.logout();
        req.logout();
        res.redirect('/');
    },

    sendPassword: function(req, res) {
        Stat.log.forgotPassword();
        User.findOne({ username: req.query.username }).exec()
            .then(function(user) {
                if (user !== null) {
                    mail.sendForgotPasswordEmail(user.username, user.password);

                    res.json({ success: true });
                } else {
                    res.json({ notFound: true });
                }
            });
    }
};
