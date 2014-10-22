var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var Episode = new Schema({
    name: { type: String },
    title: { type: String, unique: true, dropDups: true },
    image: { type: String },
    difficulty: { type: String },
    publicationDate: { type: Date },
    description: { type: String },
    category: { type: [String] },
    lexica: { type: [String] },
    processed: { type: String },
    link: { type: String }
});

module.exports = {
    Episode: mongoose.model('Episode', Episode)
};
