const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		index: {
			unique: true,
			background: false,
		},
	},
	password: {
		type: String,
		required: true,
	},
	organization: {
		type: Schema.Types.ObjectId,
		ref: "organization",
		required: true,
	},
	admin: {
		type: Boolean,
		default: false,
	},
});

module.exports = User = mongoose.model("user", UserSchema);
