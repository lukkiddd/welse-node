import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
const Schema = mongoose.Schema;

// Create a schema
const friendSchema = new Schema({
	friend: {
		type: String,
		ref: 'User'
	},
	isRequest: Boolean,
	_user: {
		type: String
	}
});

const Friend = mongoose.model('Friend', friendSchema.plugin(timestamps));
export { Friend };