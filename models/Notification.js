import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
const Schema = mongoose.Schema;

// Create a schema
const notificationSchema = new Schema({
	message: {
		type: String
	},
	name: {
		type: String
	},
	_user: {
		type: Schema.Types.ObjectId, ref: 'User'
	},
	_patient: {
		type: Schema.Types.ObjectId, ref: 'User'
	},
	read: Boolean
});

const Notification = mongoose.model('Notification', notificationSchema.plugin(timestamps));
export { Notification };