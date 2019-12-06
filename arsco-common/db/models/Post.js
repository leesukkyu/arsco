const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.plugin(require('mongoose-create-unique'));

const postSchema = new Schema({
  id: {
    type: String,
    unique: true,
    dropDups: true,
    required: true,
  },
  caption: Schema.Types.Mixed,
  carousel_media: Schema.Types.Mixed,
  comments: Schema.Types.Mixed,
  created_time: Number,
  filter: Schema.Types.Mixed,
  images: Schema.Types.Mixed,
  likes: Schema.Types.Mixed,
  link: String,
  location: Schema.Types.Mixed,
  tags: [String],
  type: String,
  user: Schema.Types.Mixed,
  videos: Schema.Types.Mixed,
});

module.exports = mongoose.model('Post', postSchema);
