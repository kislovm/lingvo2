var Login = require('./login');
var Marionette = require('backbone.marionette');
var $ = require('jquery');
var Restore = require('./restore');

module.exports = Marionette.ItemView.extend({

    template: require('../../templates/register.hbs'),

    events: {
        'click .sign-login': 'onLogin',
        'click .sign-in': 'onSignIn',
        'click .login-m-form-restore': 'onRestore',
        'click .auth-close-a-js': 'onClose'
    },

    emailRegexp: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,

    getFormData: function() {
        return this.$el.find('form').serialize();
    },

    validate: function() {
        var isEmailValid = this.emailRegexp.test(this.$el.find('.login-input').val());
        var isPasswordValid = this.$el.find('.password-input').val().length > 0;
        var isPasswordConfirmValid = this.$el.find('.password-confirm-input').val() === this.$el.find('.password-input').val();

        if (!isEmailValid) {
            this.setError('Please enter correct email');
        } else if (!isPasswordValid) {
            this.setError('Please enter password');
        } else if (!isPasswordConfirmValid) {
            this.setError('Please enter same password');
        } else {
            this.hideError();
        }

        return isEmailValid && isPasswordValid && isPasswordConfirmValid;
    },

    setError: function(error) {
        this.$el.find('.form-error').text(error);
        this.$el.find('.form-error').removeClass('hidden');
    },

    hideError: function() {
        this.$el.find('.form-error').addClass('hidden');
    },

    onLogin: function() {
        if (this.validate()) {
            $.get('/auth/email', this.getFormData(), this.onLoginRequest.bind(this), 'json')
                .fail(function() {
                    this.setError(i18n.t('Wrong password'));
                }.bind(this));
        }
    },

    onRestore: function() {
        this.remove();
        App.layoutView.showChildView('authorization', new Restore());
    },

    onSignIn: function() {
        this.remove();
        App.core.vent.trigger('show-login');
    },
    onClose: function() {
        this.remove();
        App.core.vent.trigger('show-login');
        $('.b-authorization').toggleClass("b-authorization--visibility");
        $('body').toggleClass("body-fixed");
    },

    onLoginRequest: function(data) {
        if (data && data.success === true) {
            window.location.reload();
        }
    }
});
