import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
var Schema = mongoose.Schema;

// Create a schema
var healthSchema = new Schema({
	chartType: String,
	name: String,
	timestamp: Date,
	unit: String,
	value: Number,
	max: Number,
	_user: String
});

var Health = mongoose.model('Health', healthSchema.plugin(timestamps));

export default Health;