const chai = require("chai");
const assert = require("chai").assert;
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const app = require("../server");

chai.use(chaiHttp);

describe("GET ", () => {
	beforeEach(async () => {
		const newOrg = new Organization({
			name: "Red Wolf Development",
		});

		const newUser = new User({
			firstName: "Cameron",
			lastName: "Pennington",
			email: "cameron.pennington@gmail.com",
			password: "password",
		});
		const newUser2 = new User({
			firstName: "John",
			lastName: "Doe",
			email: "john@doe.com",
			password: "password",
		});

		const newTask = new Task({
			name: "Brushing your teeth",
		});

		const newTask2 = new Task({
			name: "Washing your car",
		});

		const newStep = new Step({
			text: "Find your toothbrush",
		});

		const newStep2 = new Step({
			text: "Find the toothpaste",
		});

		newOrg.users.push(newUser);
		newOrg.users.push(newUser2);

		newOrg.tasks.push(newTask);
		newOrg.tasks.push(newTask2);

		newUser.organization = newOrg;
		newUser2.organization = newOrg;

		newTask.organization = newOrg;
		newTask2.organization = newOrg;

		newTask.steps.push(newStep);
		newTask.steps.push(newStep2);

		newStep.task = newTask;
		newStep2.task = newTask;

		await newOrg.save();

		await newUser.save();
		await newUser2.save();

		await newTask.save();
		await newTask2.save();

		await newStep.save();
		await newStep2.save();

		this.orgId = newOrg.id;
		this.taskId = newTask.id;

		//create plain user object
		const tokenUser = {
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			email: newUser.email,
			password: newUser.password,
			admin: false,
		};
		const tokenAdminUser = {
			firstName: newUser2.firstName,
			lastName: newUser2.lastName,
			email: newUser2.email,
			password: newUser2.password,
			admin: true,
		};
		const token = jwt.sign(tokenUser, keys.secretOrKey);
		const adminToken = jwt.sign(tokenAdminUser, keys.secretOrKey);

		this.testToken = "Bearer " + token;
		this.testAdminToken = "Bearer " + adminToken;
	});

	it("/user/:orgId gets all users for an organization", (done) => {
		chai
			.request(app)
			.get(`/user/${this.orgId}`)
			.set("Authorization", this.testAdminToken)
			.end((err, res) => {
				assert.lengthOf(res.body.users, 2);
				assert.equal(res.status, 200);
				done();
			});
	});

	it("/user/:orgId throws a 403 error if the user does not have admin access", (done) => {
		chai
			.request(app)
			.get(`/user/${this.orgId}`)
			.set("Authorization", this.testToken)
			.end((err, res) => {
				assert.equal(res.status, 403);
				assert.equal(res.body.message, "Admin access is required");
				done();
			});
	});
	it("/user/:orgId throws a 401 error if there is no auth token", (done) => {
		chai
			.request(app)
			.get(`/user/${this.orgId}`)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "No token, authorization denied");
				done();
			});
	});
	it("/user/:orgId throws a 401 error if the token is invalid", (done) => {
		chai
			.request(app)
			.get(`/user/${this.orgId}`)
			.set("Authorization", "fakeToken")
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "Invalid token");
				done();
			});
	});
	it("/task/:orgId gets all tasks", (done) => {
		chai
			.request(app)
			.get(`/task/${this.orgId}/`)
			.set("Authorization", this.testToken)
			.end((err, res) => {
				assert.lengthOf(res.body.tasks, 2);
				assert.equal(res.status, 200);
				done();
			});
	});
	it("/task/:orgId throws a 401 error if there is no auth token", (done) => {
		chai
			.request(app)
			.get(`/task/${this.orgId}/`)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "No token, authorization denied");
				done();
			});
	});
	it("/task/:orgId throws a 401 error if the token is invalid", (done) => {
		chai
			.request(app)
			.get(`/task/${this.orgId}/`)
			.set("Authorization", "fakeToken")
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "Invalid token");
				done();
			});
	});
	it("/step/:taskId gets all steps", (done) => {
		chai
			.request(app)
			.get(`/step/${this.taskId}/`)
			.set("Authorization", this.testToken)
			.end((err, res) => {
				assert.lengthOf(res.body.steps, 2);
				assert.equal(res.status, 200);
				done();
			});
	});
	it("/step/:taskId throws a 401 error if there is no auth token", (done) => {
		chai
			.request(app)
			.get(`/step/${this.taskId}/`)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "No token, authorization denied");
				done();
			});
	});
	it("/step/:taskId throws a 401 error if the token is invalid", (done) => {
		chai
			.request(app)
			.get(`/step/${this.taskId}/`)
			.set("Authorization", "fakeToken")
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "Invalid token");
				done();
			});
	});
});
