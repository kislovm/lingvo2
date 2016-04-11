var Mail = require('mail').Mail;

var SMTPHandler = function() {
    this.mailer = Mail({
        host: 'smtp.yandex.ru',
        username: 'admin@upvoc.com',
        password: '1jklh2',
        port: 465
    });

    this.senderEmail = 'noreply@upvoc.com';

    this.send = function(toEmail, message) {
        this.mailer.message({
            from: this.senderEmail,
            to: [toEmail],
            subject: 'Upvoc.com registration'
        })
        .body(message)
        .send();
    };
};


var sendRegistrationEmail = function(email) {
    new SMTPHandler().send(email, 'Hi! You just registered on http://upvoc.com. Thank you.');
};

module.exports = {
    sendRegistrationEmail: sendRegistrationEmail
};