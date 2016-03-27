var Login = require('./login');
var Marionette = require('backbone.marionette');
var $ = require('jquery');

module.exports = Marionette.ItemView.extend({

    template: require('../../templates/register.hbs'),

    events: {
        'click .sign-login': 'onLogin',
        'click .sign-in': 'onSignIn'
    },

    emailRegexp: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,

    getFormData: function() {
        return this.$el.find('form').serialize();
    },

    validate: function() {
        var isEmailValid = this.emailRegexp.test(this.$el.find('.login-input').val());
        var isPasswordValid = this.$el.find('.password-input').val().length > 0;
        var isPasswordConfirmValid = this.$el.find('.password-confirm-input').val() === this.$el.find('.password-input').val();

        if(!isEmailValid) {
            alert('Please enter correct email');
        } else if(!isPasswordValid) {
            alert('Please enter password');
        } else if(!isPasswordConfirmValid) {
            alert('Please enter same password');
        }

        return isEmailValid && isPasswordValid && isPasswordConfirmValid;
    },

    onLogin: function() {
        if(this.validate()) {
            $.get('/auth/email', this.getFormData(), this.onLoginRequest.bind(this), 'json')
                .fail(function() {
                    alert('Wrong password');
                });
        }
    },

    onSignIn: function() {
        this.remove();
        App.core.vent.trigger('show-login');
    },

    onLoginRequest: function(data) {
        if(data && data.success === true) {
            window.location.reload();
        }
    }
});