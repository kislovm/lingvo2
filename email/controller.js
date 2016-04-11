var Email = require('email').Email;

var senderMail = 'noreply@upvoc.com';

var sendRegistrationEmail = function(email) {
    new Email({
        from: senderMail,
        to: email,
        subject: 'Upvoc.com registration',
        body: 'Hi! You just registered on http://upvoc.com. Thank you.'
    })
    .send();
};

module.exports = {
    sendRegistrationEmail: sendRegistrationEmail
};