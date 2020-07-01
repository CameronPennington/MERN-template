const assert = require("chai").assert;
const Organization = require("../models/Organization.js");
const User = require("../models/User");
const Task = require("../models/Task");
const Step = require("../models/Step");

describe("Successfully retrieves", () => {
	beforeEach(async () => {
		newOrg = new Organization({
			name: "Red Wolf Development",
		});

		newOrg2 = new Organization({
			name: "Covington",
		});

		newUser = new User({
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@email.com",
			password: "password",
		});

		newUser2 = new User({
			firstName: "Jane",
			lastName: "Doe",
			email: "jane.doe@email.com",
			password: "password",
		});

		newTask = new Task({
			name: "Brushing your teeth",
		});

		newTask2 = new Task({
			name: "Washing your car",
		});

		newStep = new Step({
			text: "Find your toothbrush",
		});

		newStep2 = new Step({
			text: "Find your car",
		});

		newOrg.users.push(newUser);
		newOrg.tasks.push(newTask);

		newOrg2.users.push(newUser2);
		newOrg2.tasks.push(newTask2);

		newUser.organization = newOrg;
		newUser2.organization = newOrg2;

		newTask.organization = newOrg;
		newTask2.organization = newOrg2;

		newTask.steps.push(newStep);
		newTask2.steps.push(newStep2);

		newStep.task = newTask;
		newStep2.task = newTask2;

		await newOrg.save();
		await newOrg2.save();
		await newUser.save();
		await newUser2.save();
		await newTask.save();
		await newTask2.save();
		await newStep.save();
		await newStep2.save();
	});

	it("organization records", async () => {
		const results = await Organization.find();
		assert.lengthOf(results, 2);
	});

	it("user records", async () => {
		const results = await User.find();

		assert.lengthOf(results, 2);
	});

	it("task records", async () => {
		const results = await Task.find();
		assert.lengthOf(results, 2);
	});

	it("step records", async () => {
		const results = await Step.find();
		assert.lengthOf(results, 2);
	});
});
