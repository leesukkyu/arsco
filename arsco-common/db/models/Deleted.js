var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deletedSchema = new Schema({
    id: String,
})

module.exports = mongoose.model('Deleted', deletedSchema);