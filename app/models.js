var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Mixed = Schema.Types.Mixed;


var Episode = new Schema({
    name: { type: String },
    title: { type: String, unique: true, dropDups: true },
    image: { type: String },
    difficulty: { type: String },
    publicationDate: { type: Date },
    description: { type: String },
    processedDescription: { type: Mixed },
    processedBody: { type: Mixed },
    category: { type: [String] },
    lexica: { type: [String] },
    tokens: { type: [String] },
    processed: { type: String },
    link: { type: String },
    body: { type: String },
    originalArticleLink: { type: String }
});

module.exports = {
    Episode: mongoose.model('Episode', Episode)
};
