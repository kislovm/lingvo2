var Marionette = require('backbone.marionette');
var $ = require('jquery');
var Register = require('./register');

module.exports = Marionette.ItemView.extend({

    template: require('../../templates/restore.hbs'),

    events: {
        'click .sign-in': 'onSignIn',
        'click .sign-up': 'onSignUp',
        'click .sign-login': 'onLogin',
        'click .auth-close-a-js': 'onClose',
    },

    onSignIn: function() {
        this.remove();
        App.core.vent.trigger('show-login');
    },

    onSignUp: function() {
        this.remove();
        App.core.vent.trigger('show-register');
    },

    onClose: function() {
        this.remove();
        App.core.vent.trigger('show-login');
        $('.b-authorization').toggleClass("b-authorization--visibility");
        $('body').toggleClass("body-fixed");
    },

    onLogin: function() {
        if (this.validate()) {
            $.get('/auth/forgot', this.getFormData(), this.onLoginRequest.bind(this), 'json')
                .fail(function() {
                    this.setError('Wrong password');
                }.bind(this));
        }
    },

    emailRegexp: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,

    getFormData: function() {
        return this.$el.find('form').serialize();
    },

    validate: function() {
        var isEmailValid = this.emailRegexp.test(this.$el.find('.login-input').val());

        if (!isEmailValid) {
            this.setError('Please enter correct email');
        } else {
            this.hideError();
        }

        return isEmailValid;
    },

    setError: function(error) {
        this.$el.find('.form-error').text(error);
        this.$el.find('.form-error').removeClass('hidden');
    },

    hideError: function() {
        this.$el.find('.form-error').addClass('hidden');
    },

    onLoginRequest: function(data) {
        if (data) {
            if (data.success === true) {
                this.setError('Password sent to provided email');
            } else if (data.notFound === true) {
                this.setError('Provided email not found');
            }
        }
    }

});
