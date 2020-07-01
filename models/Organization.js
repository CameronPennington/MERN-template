const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const OrganizationSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: "user",
		},
	],
	tasks: [
		{
			type: Schema.Types.ObjectId,
			ref: "task",
		},
	],
});

module.exports = Organization = mongoose.model(
	"organization",
	OrganizationSchema
);
