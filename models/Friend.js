import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
const Schema = mongoose.Schema;

// Create a schema
const friendSchema = new Schema({
	friends: {
		type: [Schema.Types.ObjectId]
	},
	friendRequest: {
		type: [Schema.Types.ObjectId]
	}
});

const Friend = mongoose.model('Friend', friendSchema.plugin(timestamps));
export { Friend };