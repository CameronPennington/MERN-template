const express = require("express");
const router = express.Router();
const auth = require("../utils/authMiddleware");
const Organization = require("../models/Organization");
const Task = require("../models/Task.js");

//get all tasks for an org

router.get("/:orgId", auth, async (req, res) => {
	try {
		const organization = await Organization.findById(req.params.orgId)
			.populate("tasks")
			.catch((err) => {
				throw err;
			});

		const tasks = organization.tasks;
		const orgName = organization.name;
		const resBody = { tasks, orgName };
		res.status(200).json(resBody);
	} catch (err) {
		throw err;
	}
});

router.post("/:orgId", auth, async (req, res) => {
	try {
		const organization = await Organization.findById(req.params.orgId)
			.populate("tasks")
			.catch((err) => {
				throw err;
			});

		const newTask = new Task({
			name: req.body.name,
			organization: req.params.orgId,
		});
		await newTask.save().catch((err) => {
			throw err;
		});
		organization.tasks.push(newTask);

		await organization.save().catch((err) => {
			throw err;
		});
		const tasks = organization.tasks;
		const resBody = { tasks };

		res.status(200).json(resBody);
	} catch (err) {
		throw err;
	}
});

router.patch("/:orgId/:taskId", auth, async (req, res) => {
	try {
		const { orgId, taskId } = req.params;

		const task = await Task.findById(taskId).catch((err) => {
			throw err;
		});

		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		task.name = req.body.name;

		await task.save().catch((err) => {
			throw err;
		});

		const tasks = await Task.find({ organization: orgId }).catch((err) => {
			throw err;
		});

		const resBody = { tasks };

		res.status(200).json(resBody);
	} catch (err) {
		throw err;
	}
});

router.delete("/:orgId/:taskId", auth, async (req, res) => {
	try {
		const { orgId, taskId } = req.params;
		const organization = await Organization.findById(orgId)
			.populate("tasks")
			.catch((err) => {
				throw err;
			});
		if (!organization) {
			return res.status(404).json({ message: "Task not found" });
		}
		organization.tasks.pull(taskId);
		await organization.save().catch((err) => {
			throw err;
		});

		await Task.findByIdAndDelete(taskId).catch((err) => {
			throw err;
		});

		const tasks = organization.tasks;
		const resBody = { tasks };
		res.status(200).send(resBody);
	} catch (err) {
		throw err;
	}
});

module.exports = router;
