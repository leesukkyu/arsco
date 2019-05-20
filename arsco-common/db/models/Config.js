var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var configSchema = new Schema({
    loadServer : String,
    tree: Schema.Types.Mixed,
})

module.exports = mongoose.model('Config', configSchema);