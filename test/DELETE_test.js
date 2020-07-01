const chai = require("chai");
const assert = require("chai").assert;
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const app = require("../server");

chai.use(chaiHttp);

describe("DELETE ", () => {
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
		newStep.task = newOrg;

		await newOrg.save();
		await newUser.save();
		await newTask.save();
		await newStep.save();

		this.orgId = newOrg.id;
		this.userId = newUser.id;
		this.taskId = newTask.id;
		this.stepId = newStep.id;

		const tokenUser = {
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			email: newUser.email,
			password: newUser.password,
			admin: false,
		};

		const tokenAdminUser = {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@email.com",
			password: "password",
			admin: true,
		};

		const token = jwt.sign(tokenUser, keys.secretOrKey);
		const adminToken = jwt.sign(tokenAdminUser, keys.secretOrKey);

		this.testToken = "Bearer " + token;
		this.testAdminToken = "Bearer " + adminToken;
	});

	it("/user/:userId deletes a user", (done) => {
		chai
			.request(app)
			.delete(`/user/${this.orgId}/${this.userId}/`)
			.set("Authorization", this.testAdminToken)
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.lengthOf(res.body.users, 0);
				done();
			});
	});
	it("/user/:userId throws a 403 error if the user is not an admin", (done) => {
		chai
			.request(app)
			.delete(`/user/${this.orgId}/${this.userId}/`)
			.set("Authorization", this.testToken)
			.end((err, res) => {
				assert.equal(res.status, 403);
				assert.equal(res.body.message, "Admin access is required");
				done();
			});
	});
	it("/user/:userId throws a 401 error if there is no token", (done) => {
		chai
			.request(app)
			.delete(`/user/${this.orgId}/${this.userId}/`)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "No token, authorization denied");
				done();
			});
	});
	it("/user/:userId throws a 401 error if the token is invalid", (done) => {
		chai
			.request(app)
			.delete(`/user/${this.orgId}/${this.userId}/`)
			.set("Authorization", "fakeToken")
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "Invalid token");
				done();
			});
	});
	it("/task/:orgId/:taskId deletes a task", (done) => {
		chai
			.request(app)
			.delete(`/task/${this.orgId}/${this.taskId}`)
			.set("Authorization", this.testToken)
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.lengthOf(res.body.tasks, 0);
				done();
			});
	});
	it("/task/:orgId/:taskId throws a 401 error if there is no token", (done) => {
		chai
			.request(app)
			.delete(`/task/${this.orgId}/${this.taskId}`)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "No token, authorization denied");
				done();
			});
	});
	it("/task/:orgId/:taskId throws a 401 error if the token is invalid", (done) => {
		chai
			.request(app)
			.delete(`/task/${this.orgId}/${this.taskId}`)
			.set("Authorization", "fakeToken")
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "Invalid token");
				done();
			});
	});

	it("/step/:taskId/:stepId deletes a step", (done) => {
		chai
			.request(app)
			.delete(`/step/${this.taskId}/${this.stepId}`)
			.set("Authorization", this.testToken)
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.lengthOf(res.body.steps, 0);
				done();
			});
	});
	it("/step/:taskId/:stepId throws a 401 error if there is no token", (done) => {
		chai
			.request(app)
			.delete(`/step/${this.taskId}/${this.stepId}`)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "No token, authorization denied");
				done();
			});
	});
	it("/step/:taskId/:stepId throws a 401 error if the token is invalid", (done) => {
		chai
			.request(app)
			.delete(`/step/${this.taskId}/${this.stepId}`)
			.set("Authorization", "fakeToken")
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "Invalid token");
				done();
			});
	});
});
