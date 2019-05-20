var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    id: {
        type: String,
        unique: true,
        dropDups: true,
        required: true
    },
    caption: Schema.Types.Mixed,
    carousel_media : Schema.Types.Mixed,
    comments: Schema.Types.Mixed,
    created_time: Number,
    filter: Schema.Types.Mixed,
    id : String,
    images : Schema.Types.Mixed,
    likes : Schema.Types.Mixed,
    link : String,
    location: Schema.Types.Mixed,
    tags: [String],
    type : String,
    user : Schema.Types.Mixed,
    videos : Schema.Types.Mixed
})

module.exports = mongoose.model('Post', postSchema);