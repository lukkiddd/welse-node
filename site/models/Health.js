import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
var Schema = mongoose.Schema;

// Create a schema
var healthSchema = new Schema({
	chartType: String,
	name: {
		type: String,
	},
	timestamp: String,
	unit: String,
	value: Number,
	max: Number,
	type: String,
	isDanger: Boolean,
	_user: String
});

var Health = mongoose.model('Health', healthSchema.plugin(timestamps));

export { Health };