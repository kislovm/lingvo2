var Marionette = require('backbone.marionette');

var $ = require('jquery');

module.exports = Marionette.View.extend({

    template: false,

    events: {
        'click .my-words-js': 'myWords',
        'click .authorization-js': 'authorization',
        'click .settings-a-js': 'settings',
        'click .dictionaries-js': 'dictionaries',
        'click .language-js': 'language',
        'click .switch-lang': 'language',
        'click .sort-js': 'sort',
        'click .sorting-block-select': 'sort',
        'mouseenter .b-dictionaries-block__words': 'dMouseenter',
        'mouseleave .b-dictionaries-block__words': 'dMouseleave'
    },

    myWords: function() {
        this.$el.find('.b-dictionaries-block').toggleClass("b-authorization--visibility");
        this.$el.find('.b-dictionaries-block').toggleClass('b-dictionaries-block--visibility');
        /*
        if ($(window).width() >= '1120') {
            this.$el.find('.episodes-js').toggleClass("col-sm-offset-2");
            this.$el.find('.dictionaries-center-block-js').toggleClass("col-sm-offset-2");
            this.$el.find('.dictionaries-block-js').toggleClass("col-sm-3");
        }
        */
        if ($(window).width() >= '1186') {
            this.$el.find(".episodes-js").toggleClass("col-sm-10");
            this.$el.find(".episodes-js").toggleClass("col-sm-9");
            this.$el.find('.episodes-js').toggleClass("col-sm-offset-1");
            this.$el.find('.episodes-js').toggleClass("p-main--pad6");
            this.$el.find('.dictionaries-center-block-js').toggleClass("p-main--pad6");
            this.$el.find('.dictionaries-block-js').toggleClass("col-sm-3");
            this.$el.find('.dictionaries-center-block-js').toggleClass("col-sm-offset-1");
            this.$el.find(".dictionaries-center-block-js").toggleClass("col-sm-10");
            this.$el.find(".dictionaries-center-block-js").toggleClass("col-sm-9");
        }
        if ($(window).width() >= '751' && $(window).width() <= '1185') {
            this.$el.find(".episodes-js").toggleClass("col-sm-10");
            this.$el.find(".episodes-js").toggleClass("col-sm-8");
            this.$el.find('.episodes-js').toggleClass("col-sm-offset-1");
            this.$el.find('.dictionaries-block-js').toggleClass("col-sm-4");
            this.$el.find('.dictionaries-center-block-js').toggleClass("col-sm-offset-1");
            this.$el.find(".dictionaries-center-block-js").toggleClass("col-sm-10");
            this.$el.find(".dictionaries-center-block-js").toggleClass("col-sm-8");
            this.$el.find('.episodes-js').toggleClass("p-main--pad6");
            this.$el.find('.dictionaries-center-block-js').toggleClass("p-main--pad6");
        }
        /*
        if ($(window).width() >= '751' && $(window).width() <= '900') {
            this.$el.find(".episodes-js").toggleClass("col-sm-10");
            this.$el.find(".episodes-js").toggleClass("col-sm-8");
            this.$el.find('.episodes-js').toggleClass("col-sm-offset-1");
            this.$el.find('.dictionaries-block-js').toggleClass("col-sm-3");
            this.$el.find('.dictionaries-center-block-js').toggleClass("col-sm-offset-1");
            this.$el.find(".dictionaries-center-block-js").toggleClass("col-sm-10");
            this.$el.find(".dictionaries-center-block-js").toggleClass("col-sm-8");
            $('.b-episode').toggleClass("b-episode--margin");
            $('.b-categories').toggleClass("b-categories--padding");
        }
        */
        if ($(window).width() <= '750') {
            $('body').toggleClass("body-fixed");
        }
    },
    authorization: function() {
        this.$el.find('.b-authorization').toggleClass("b-authorization--visibility");
        $('body').toggleClass("body-fixed");
        $('.p-main').toggleClass("p-main--fix");
    },
    settings: function() {
        this.$el.find('.b-settings').toggleClass("b-settings--visibility");
        if ($(window).width() <= '750') {
            $('body').toggleClass("body-fixed");
            $('.p-main').toggleClass("p-main--fix");
        }

    },
    dictionaries: function() {
        this.$el.find('.b-dictionaries').toggleClass("b-dictionaries--visibility");
        $('body').toggleClass("body-fixed");
        $('.p-main').toggleClass("p-main--fix");
    },
    dMouseenter: function() {
        $('body').css("overflow","hidden");
    },
    dMouseleave: function() {
        $('body').css("overflow","auto");
    },
    language: function() {
        this.$el.find('.language-b-js').toggleClass("b-select--visibility");
    },
    sort: function() {
        this.$el.find('.sort-b-js').toggleClass("b-select--visibility");
    }
});
