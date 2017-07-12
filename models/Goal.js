import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
const Schema = mongoose.Schema;

// Create a schema
const goalSchema = new Schema({
	name: {
		type: String,
		trim: true,
		lowercase: true
	},
	value: {
		type: Number
	}
});

const Goal = mongoose.model('Goal', goalSchema.plugin(timestamps));
export { Goal };