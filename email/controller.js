var nodemailer = require('nodemailer');

var SMTPHandler = function() {
    this.mailer = nodemailer.createTransport('smtps://admin%40upvoc.com:1jklh2@smtp.yandex.ru');
    this.senderEmail = 'admin@upvoc.com';

    this.send = function(toEmail, message) {
        this.mailer.sendMail({
            from: this.senderEmail,
            to: toEmail,
            subject: 'Upvoc.com registration',
            text: message,
            html: message
        }, this.handleSent.bind(this))
    };

    this.handleSent = function(error, info) {
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    }
};


var sendRegistrationEmail = function(email) {
    new SMTPHandler().send(email, 'Hi! You just registered on http://upvoc.com. Thank you.');
};

var sendForgotPasswordEmail = function(email, password) {
    new SMTPHandler().send(email, 'Hi! Your http://upvoc.com password is ' + password + '. Thank you.');
};

module.exports = {
    sendRegistrationEmail: sendRegistrationEmail,
    sendForgotPasswordEmail: sendForgotPasswordEmail
};