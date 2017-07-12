var mongoose = require('mongoose');
import timestamps from 'mongoose-timestamp';
var Schema = mongoose.Schema;

// Create a schema
var healthSchema = new Schema({
	chartType: String,
	name: String,
	timestamp: Date,
	unit: String,
	value: Number
});

var Health = mongoose.model('Health', healthSchema.plugin(timestamps));

module.exports = Health;