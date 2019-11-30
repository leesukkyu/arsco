const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configSchema = new Schema({
  loadServer: String,
  tree: Schema.Types.Mixed,
});

module.exports = mongoose.model('Config', configSchema);
