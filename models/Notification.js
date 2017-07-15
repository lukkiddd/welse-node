import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
const Schema = mongoose.Schema;

// Create a schema
const notificationSchema = new Schema({
	message: {
		type: String
	},
	_user: {
		type: String
	},
	read: Boolean
});

const Notification = mongoose.model('Notification', notificationSchema.plugin(timestamps));
export { Notification };