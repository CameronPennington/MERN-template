const assert = require("chai").assert;
const mongoose = require("mongoose");
const Organization = require("../models/Organization.js");
const User = require("../models/User");
const Task = require("../models/Task");
const Step = require("../models/Step");

describe("Successfully updates", () => {
	beforeEach(async () => {
		const newOrg = new Organization({
			name: "Red Wolf Development",
		});

		const newUser = new User({
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@email.com",
			password: "password",
		});

		const newTask = new Task({
			name: "Brushing your teeth",
		});

		const newStep = new Step({
			text: "Find your toothbrush",
		});

		newOrg.users.push(newUser);
		newOrg.tasks.push(newTask);
		newUser.organization = newOrg;
		newTask.organization = newOrg;
		newTask.steps.push(newStep);
		newStep.task = newTask;

		await newOrg.save();
		await newUser.save();
		await newTask.save();
		await newStep.save();

		this.orgId = newOrg.id;
		this.userId = newUser.id;
		this.taskId = newTask.id;
		this.stepId = newStep.id;
	});

	it("organization records", async () => {
		const org = await Organization.findById(this.orgId);
		org.set("name", "Covington");
		await org.save();
		assert.equal(org.name, "Covington");
	});

	it("user records", async () => {
		const user = await User.findById(this.userId);
		user.set("lastName", "Fleming");
		await user.save();
		assert.equal(user.lastName, "Fleming");
	});

	it("task records", async () => {
		const task = await Task.findById(this.taskId);
		task.set("name", "Washing your car");
		await task.save();
		assert.equal(task.name, "Washing your car");
	});
	it("step records", async () => {
		const step = await Step.findById(this.stepId);
		step.set("text", "Find your car");
		await step.save();
		assert.equal(step.text, "Find your car");
	});
});
