const express = require("express");
const router = express.Router();
const auth = require("../utils/authMiddleware");
const Task = require("../models/Task.js");
const Step = require("../models/Step.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadMedia = require("../utils/cloudinary").uploadMedia;
const deleteMedia = require("../utils/cloudinary").deleteMedia;

router.get("/:taskId", auth, async (req, res) => {
	try {
		const task = await Task.findById(req.params.taskId)
			.populate("steps")
			.catch((err) => {
				throw err;
			});

		const { steps } = task;
		const taskName = task.name;
		const resBody = { steps, taskName };

		res.status(200).send(resBody);
	} catch (err) {
		throw err;
	}
});

router.post("/:taskId", [auth, upload.single("media")], async (req, res) => {
	try {
		const newStep = Step({
			text: req.body.text,
		});

		if (req.file) {
			if (req.file.size > 1000000) {
				return res.status(413).json({ message: "File size is too large" });
			}

			try {
				const result = await uploadMedia(req).catch((err) => {
					throw err;
				});

				newStep.media.url = result.url;
				newStep.media.cloudId = result.public_id;
			} catch (err) {
				throw err;
			}
		}

		const task = await Task.findById(req.params.taskId)
			.populate("steps")
			.catch((err) => {
				throw err;
			});

		task.steps.push(newStep);
		newStep.task = task;
		await newStep.save().catch((err) => {
			throw err;
		});
		await task.save().catch((err) => {
			throw err;
		});

		const { steps } = task;
		const resBody = { steps };

		res.status(200).json(resBody);
	} catch (err) {
		throw err;
	}
});

router.patch(
	"/:taskId/:stepId",
	[auth, upload.single("media")],
	async (req, res) => {
		try {
			const { taskId, stepId } = req.params;
			const step = await Step.findById(stepId).catch((err) => {
				throw err;
			});

			if (req.body.text.length > 0) {
				step.text = req.body.text;
			}
			if (req.body.deleteMedia) {
				try {
					await deleteMedia(req.body.cloudId).catch((err) => {
						throw err;
					});
					step.media = undefined;
				} catch (err) {
					throw err;
				}
			}
			if (req.file) {
				if (req.file.size > 1000000) {
					return res.status(413).json({ message: "File size is too large" });
				}

				try {
					const result = await uploadMedia(req);

					step.media.url = result.url;
					step.media.cloudId = result.public_id;
				} catch (err) {
					throw err;
				}
			}

			await step.save().catch((err) => {
				throw err;
			});
			const steps = await Step.find({ task: taskId }).catch((err) => {
				throw err;
			});
			const resBody = { steps };
			res.status(200).json(resBody);
		} catch (err) {
			throw err;
		}
	}
);

router.delete("/:taskId/:stepId", auth, async (req, res) => {
	try {
		const { taskId, stepId } = req.params;

		const task = await Task.findById(taskId)
			.populate("steps")
			.catch((err) => {
				throw err;
			});
		task.steps.pull(stepId);
		await task.save().catch((err) => {
			throw err;
		});

		const step = await Step.findById(stepId).catch((err) => {
			throw err;
		});
		if (step.media) {
			await deleteMedia(step.media.cloudId);
		}
		await Step.findByIdAndDelete(stepId).catch((err) => {
			throw err;
		});
		const { steps } = task;
		const resBody = { steps };
		res.status(200).send(resBody);
	} catch (err) {
		throw err;
	}
});
module.exports = router;
