var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Episode = new Schema({
    name: { type: String },
    title: { type: String, unique: true, dropDups: true },
    image: { type: String },
    difficulty: { type: String },
    publicationDate: { type: Date },
    description: { type: String },
    processedDescription: { type: String },
    processedBody: { type: String },
    category: { type: [String] },
    lexica: { type: [String] },
    tokens: { type: [String] },
    processed: { type: String },
    link: { type: String },
    body: { type: String },
    originalArticleLink: { type: String }
});

Episode.index({ publicationDate: -1, category: 1 });

var User = new Schema({
    oauthID: Number,
    created: Date,
    name: String,
    username: String,
    password: String,
    email: String,
    language: String,
    autosave: { type: Boolean, default: true },
    selected: { type: Schema.Types.ObjectId, ref: 'Dictionary' }
});

User.methods.verifyPassword = function(password) {
    return this.password === password;
};

var Dictionary = {
    name: String,
    created: Date,
    deletable: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    words: [{ type: Schema.Types.ObjectId, ref: 'Word' }]
};

var Word = new Schema({
    dictionary: { type: Schema.Types.ObjectId, ref: 'Dictionary' },
    text: String
});

Word.pre('remove', function(next){
    this.model('Dictionary').update(
        {words: {$in: [this._id]}},
        {$pull: {words: this._id}},
        {multi: true},
        next
    );
});

var Translation = {
    phrase: String,
    lang: String,
    translations: String,
    transcription: String
};

var models = {
    Episode: mongoose.model('Episode', Episode),
    User: mongoose.model('User', User),
    Dictionary: mongoose.model('Dictionary', Dictionary),
    Word: mongoose.model('Word', Word),
    Translation: mongoose.model('Translation', Translation)
};

module.exports = models;
