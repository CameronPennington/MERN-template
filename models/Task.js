const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	steps: [
		{
			type: Schema.Types.ObjectId,
			ref: "step",
		},
	],
	organization: {
		type: Schema.Types.ObjectId,
		ref: "organization",
		required: true,
	},
});

module.exports = Task = mongoose.model("task", TaskSchema);
