const assert = require("chai").assert;
const mongoose = require("mongoose");
const Organization = require("../models/Organization.js");
const User = require("../models/User");
const Task = require("../models/Task");
const Step = require("../models/Step");

describe("Successfully deletes", () => {
	beforeEach(async () => {
		const newOrg = new Organization({
			name: "Red Wolf Development",
		});

		const newUser = new User({
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@email.com",
			password: "password",
			organization: mongoose.Types.ObjectId(),
		});

		const newTask = new Task({
			name: "Brushing your teeth",
			organization: mongoose.Types.ObjectId(),
		});

		const newStep = new Step({
			text: "Find your toothbrush",
			task: mongoose.Types.ObjectId(),
		});
		await newOrg.save();
		await newUser.save();
		await newTask.save();
		await newStep.save();

		this.orgId = newOrg.id;
		this.userId = newUser.id;
		this.taskId = newTask.id;
		this.stepId = newStep.id;
	});

	it("a user record", async () => {
		await User.findByIdAndDelete(this.userId);
		const user = await User.findById(this.userId);
		assert.notExists(user);
	});

	it("an organization record", async () => {
		await Organization.findByIdAndDelete(this.orgId);
		const org = await Organization.findById(this.orgId);
		assert.notExists(org);
	});

	it("a task record", async () => {
		await Task.findByIdAndDelete(this.taskId);
		const task = await Task.findById(this.taskId);
		assert.notExists(task);
	});

	it("a step record", async () => {
		await Step.findByIdAndDelete(this.stepId);
		const step = await Step.findById(this.stepId);
		assert.notExists(step);
	});
});
