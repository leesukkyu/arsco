const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deletedSchema = new Schema({
  id: String,
});

module.exports = mongoose.model('Deleted', deletedSchema);
