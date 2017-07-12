import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import validator from 'validator';
const Schema = mongoose.Schema;

// Create a schema
const userSchema = new Schema({
	email: {
		type: String,
		lowercase: true,
		unique: true,
		validate: {
			validator: (v) => {
				return validator.isEmail(v);
			},
			message: '{VALUE} is not a valid email!'
		}
	},
	password: {
		type: String,
		trim: true,
	},
	fname: {
		type: String,
		lowercase: true,
		trim: true
	},
	lname: {
		type: String,
		lowercase: true,
		trim: true
	},
	token: [Schema.Types.Mixed],
	profilePic: String,
	data: [{
		name: String,
		unit: String,
		value: String
	}]
});


const User = mongoose.model('User', userSchema.plugin(timestamps));
export { User };