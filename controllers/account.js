var Dictionary = require('../app/models').Dictionary;
var Word = require('../app/models').Word;
var Translator = require('../translator/translator');

module.exports = {

    index: function(req, res) {
        Dictionary.find({ user: req.user._id }).exec()
            .then(function(dictionaries) {
                res.render('account', { user: req.user, dictionaries: dictionaries });
            });
    },

    edit: function(req, res) {
        req.user.name = req.query.name;
        req.user.email = req.query.email;
        req.user.save()
            .then(function() {
                res.redirect('/account');
            });
    },

    listDictionary: function(req, res) {
        var user = req.user;

        Dictionary.find({ user: user._id }).exec()
            .then(function(dictionaries) {

                res.json({
                    dictionaries: dictionaries,
                    selected: user.selected.name,
                    autosave: user.autosave
                });

            });
    },

    setDictionary: function(req, res) {
        Dictionary.findOne({ name: req.body.selected, user: req.user._id })
            .then(function(dictionary) {
                req.user.autosave = req.body.autosave;
                req.user.selected = dictionary._id;
                return req.user.save();
            })
            .then(function() {
                res.json({ success: true });
            });
    },

    editDictonary: function(req, res) {
        var translator = new Translator();
        var langs = translator.languages();
        var dictionary;

        Dictionary.findOne({ name: req.params.name, user: req.user._id }).populate('words').exec()
            .then(function(dict) {
                dictionary = dict.toJSON();
                return Promise.all(dictionary.words.map(function(word) {
                    return translator.translate('en', langs[req.session.language || 'chinese'].shortcut, word.text);
                }));
            })
            .then(function(result) {
                dictionary.words.forEach(function(word, i) {
                    word.translation = result[i]
                });
                return dictionary;
            },
            function(error) { console.log(error) })
            .then(function(dictionary) {
                res.render('dictionary-edit', { user: req.user, dictionary: dictionary });
            });
    },


    deleteDictonary: function(req, res) {
        var user = req.user;

        Dictionary.find({ name: req.params.name, user: user._id }).remove().exec()
            .then(function() {
                return Dictionary.findOne({
                    user: user._id
                }).exec()
            })
            .then(function(dictionary) {
                user.selected = dictionary;
                return user.save();
            })
            .then(function() {
                res.redirect('/account');
            });
    },

    deleteWord: function(req, res) {
        Word.findOne({ _id: req.params.id }).populate('dictionary').exec()
            .then(function(word) {
                word.dictionary.words.pull({ _id: req.params.id });

                return word.dictionary.save();
            })
            .then(function() {
                return Word.remove({ _id: req.params.id }).exec()
            })
            .then(function() {
                res.redirect('/account');
            });
    },

    add: function(req, res) {
        var name = req.query.name;
        var userID = req.user._id;

        Dictionary.findOne({ name: name, user: userID }).exec()
            .then(function(dictionary) {
                if (!dictionary) {
                    return (new Dictionary({
                        name: name,
                        user: userID,
                        created: Date.now(),
                        deletable: true
                    })).save();
                }
            })
            .then(function() {
                res.redirect('/account');
            });
    },

    addWord: function(req, res) {
        var user = req.user;
        var text = req.body.word;
        var dictionary = user.selected;
        var dictId = dictionary._id;

        Word.findOne({ dictionary: dictId, text: text }).exec()
            .then(function(word) {
                if (word == null) {
                    return (new Word({
                        text: text,
                        dictionary: dictId
                    })).save();
                } else {
                    res.json({ error: 'already added' });
                }
            })
            .then(function(word){
                dictionary.words.push(word._id);
                return dictionary.save();
            })
            .then(function() {
                res.json({ success: true });
            });
    }

};