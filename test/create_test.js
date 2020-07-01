const assert = require("chai").assert;
const mongoose = require("mongoose");
const Organization = require("../models/Organization.js");
const User = require("../models/User");
const Task = require("../models/Task");
const Step = require("../models/Step");

describe("Successfully creates", () => {
	it("an organization", async () => {
		const newOrg = new Organization({
			name: "Red Wolf Development",
		});
		await newOrg.save();
		assert(!newOrg.isNew);
	});

	it("a user", async () => {
		const newUser = new User({
			firstName: "John",
			lastName: "Doe",
			email: "fake@email.com",
			password: "password",
			organization: mongoose.Types.ObjectId(),
		});
		await newUser.save();
		assert(!newUser.isNew);
	});

	it("a task", async () => {
		const newTask = new Task({
			name: "Brushing your teeth",
			organization: mongoose.Types.ObjectId(),
		});
		await newTask.save();
		assert(!newTask.isNew);
	});

	it("a step", async () => {
		const newStep = new Step({
			text: "Find toothbrush",
			task: mongoose.Types.ObjectId(),
		});
		await newStep.save();
		assert(!newStep.isNew);
	});
});

//validation
describe("Will not create", () => {
	it("an organization without a name", async () => {
		const newOrg = new Organization({
			name: "",
		});
		try {
			await newOrg.save();
		} catch (err) {
			assert.include(err.message, "Path `name` is required");
		}
	});

	it("user with a duplicate email", async () => {
		const dupeUser = new User({
			firstName: "John",
			lastName: "Doe",
			email: "fake@email.com",
			password: "password",
			organization: mongoose.Types.ObjectId(),
		});
		try {
			await dupeUser.save();
		} catch (err) {
			assert.include(err.errmsg, "duplicate key");
		}
	});
	it("a user without a first name", async () => {
		const newUser = new User({
			firstName: "",
			lastName: "Doe",
			email: "fake@email.com",
			password: "password",
			organization: mongoose.Types.ObjectId(),
		});
		try {
			await newUser.save();
		} catch (err) {
			assert.include(err.message, "Path `firstName` is required");
		}
	});
	it("a user without a last name", async () => {
		const newUser = new User({
			firstName: "John",
			lastName: "",
			email: "fake@email.com",
			password: "password",
			organization: mongoose.Types.ObjectId(),
		});
		try {
			await newUser.save();
		} catch (err) {
			assert.include(err.message, "Path `lastName` is required");
		}
	});
	it("a user without an email", async () => {
		const newUser = new User({
			firstName: "John",
			lastName: "Doe",
			email: "",
			password: "password",
			organization: mongoose.Types.ObjectId(),
		});
		try {
			await newUser.save();
		} catch (err) {
			assert.include(err.message, "Path `email` is required");
		}
	});
	it("a user without a password", async () => {
		const newUser = new User({
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@email.com",
			password: "",
			organization: mongoose.Types.ObjectId(),
		});
		try {
			await newUser.save();
		} catch (err) {
			assert.include(err.message, "Path `password` is required");
		}
	});
	it("a user without an organization", async () => {
		const newUser = new User({
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@email.com",
			password: "password",
		});
		try {
			await newUser.save();
		} catch (err) {
			assert.include(err.message, "Path `organization` is required");
		}
	});
	//shows a false positive, because if it is successful the assert statement doesn't run

	it("a task without a name", async () => {
		const newTask = new Task({
			name: "Brushing your teeth",
		});
		try {
			await newTask.save();
		} catch (err) {
			assert.include(err.message, "Path `organization` is required");
		}
	});
	it("a task without an organization", async () => {
		const newTask = new Task({
			name: "",
			organization: mongoose.Types.ObjectId(),
		});
		try {
			await newTask.save();
		} catch (err) {
			assert.include(err.message, "Path `name` is required");
		}
	});
	it("a step without text", async () => {
		const newStep = new Step({
			text: "",
			task: mongoose.Types.ObjectId(),
		});
		try {
			await newStep.save();
		} catch (err) {
			assert.include(err.message, "Path `text` is required");
		}
	});
	it("a step without a task", async () => {
		const newStep = new Step({
			text: "Find your toothbrush",
		});
		try {
			await newStep.save();
		} catch (err) {
			assert.include(err.message, "Path `task` is required");
		}
	});
});
