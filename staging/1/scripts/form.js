$(function() {
    var emailRegexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    var validate = function(form) {
        var isEmailValid = emailRegexp.test(form.find('.login-input').val());
        var isPasswordValid = form.find('.password-input').val().length > 0;

        if(!isEmailValid) {
            alert('Please enter correct email');
        } else if(!isPasswordValid) {
            alert('Please enter password');
        }

        return isEmailValid && isPasswordValid;
    };

    var onSuccess = function(data) {
        if(data && data.success === true) {
            window.location = '/';
        }
    };

    $('.language__switch-lang').change(function() {
        var value = $(this).val();

        $.post('/user/lang', { language: value });
    });

    $.post('/user/lang', { language: 'russian' });

    $('form').submit(function(e) {
        e.preventDefault();
        var form = $(this);

        if(validate(form)) {
            var formData = form.serialize();

            $.get('/auth/email', formData, onSuccess, 'json')
                .fail(function() {
                    alert('Wrong password');
                }.bind(this));
        }

    });

    $('.green-button').click(function() {
        window.yaCounter.reachGoal('green-button-click');
    });

    $('.blue-button').click(function() {
        window.yaCounter.reachGoal('blue-button-click');
    });
});
