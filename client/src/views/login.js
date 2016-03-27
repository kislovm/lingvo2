var Marionette = require('backbone.marionette');
var $ = require('jquery');
var Register = require('./register');

module.exports = Marionette.ItemView.extend({

    template: require('../../templates/login.hbs'),

    events: {
        'click .sign-login': 'onLogin',
        'click .sign-up': 'onSignUp'
    },

    emailRegexp: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,

    getFormData: function() {
        return this.$el.find('form').serialize();
    },

    validate: function() {
        var isEmailValid = this.emailRegexp.test(this.$el.find('.login-input').val());
        var isPasswordValid = this.$el.find('.password-input').val().length > 0;

        if(!isEmailValid) {
            alert('Please enter correct email');
        } else if(!isPasswordValid) {
            alert('Please enter password');
        }

        return isEmailValid && isPasswordValid;
    },

    onLogin: function() {
        if(this.validate()) {
            $.get('/auth/email', this.getFormData(), this.onLoginRequest.bind(this), 'json')
                .fail(function() {
                    alert('Wrong password');
                });
        }
    },

    onSignUp: function() {
        this.remove();
        App.layoutView.showChildView('dictionaries', new Register());
    },

    onLoginRequest: function(data) {
        if(data && data.success === true) {
            window.location.reload();
        }
    }
});
