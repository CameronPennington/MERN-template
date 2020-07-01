const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StepSchema = new Schema({
	text: {
		type: String,
		required: true,
	},
	media: {
		url: {
			type: String,
		},
		cloudId: {
			type: String,
		},
	},
	task: {
		type: Schema.Types.ObjectId,
		ref: "task",
		required: true,
	},
});

module.exports = Step = mongoose.model("step", StepSchema);
