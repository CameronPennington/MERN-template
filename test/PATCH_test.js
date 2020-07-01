const chai = require("chai");
const assert = require("chai").assert;
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const app = require("../server");

chai.use(chaiHttp);

describe("PATCH ", () => {
	beforeEach(async () => {
		const newOrg = new Organization({
			name: "Covington",
		});

		const newUser = new User({
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@gmail.com",
			password: "password",
		});

		const newTask = new Task({
			name: "Washing your car",
		});

		const newStep = new Step({
			text: "Find your car",
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

		const tokenUser = {
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			email: newUser.email,
			password: newUser.password,
			admin: false,
		};

		const tokenAdminUser = {
			firstName: "Jane",
			lastName: "Doe",
			email: "jane.doe@email.com",
			password: "password",
			admin: true,
		};

		const token = jwt.sign(tokenUser, keys.secretOrKey);
		const adminToken = jwt.sign(tokenAdminUser, keys.secretOrKey);

		this.testToken = "Bearer " + token;
		this.testAdminToken = "Bearer " + adminToken;
	});
	it("/user/:orgId/:userId updates a user", (done) => {
		const formData = {
			firstName: "Jane",
			lastName: "Dole",
			email: "",
			password: "",
			admin: false,
		};
		chai
			.request(app)
			.patch(`/user/${this.orgId}/${this.userId}`)
			.set("Authorization", this.testAdminToken)
			.send(formData)
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.users.length, 1);
				assert.equal(res.body.users[0].firstName, "Jane");
				assert.equal(res.body.users[0].lastName, "Dole");
				done();
			});
	});
	it("/user/:orgId/:userId throws a 403 error if the user is not an admin", (done) => {
		const formData = {
			firstName: "Jane",
			lastName: "Dole",
			email: "",
			password: "",
			admin: false,
		};
		chai
			.request(app)
			.patch(`/user/${this.orgId}/${this.userId}`)
			.send(formData)
			.set("Authorization", this.testToken)
			.end((err, res) => {
				assert.equal(res.status, 403);
				assert.equal(res.body.message, "Admin access is required");
				done();
			});
	});
	it("/user/:orgId/:userId throws a 401 error if there is no token", (done) => {
		const formData = {
			firstName: "Jane",
			lastName: "Dole",
			email: "",
			password: "",
			admin: false,
		};
		chai
			.request(app)
			.patch(`/user/${this.orgId}/${this.userId}`)
			.send(formData)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "No token, authorization denied");
				done();
			});
	});
	it("/user/:orgId/:userId throws a 401 error if the token is invalid", (done) => {
		const formData = {
			firstName: "Jane",
			lastName: "Dole",
			email: "",
			password: "",
			admin: false,
		};
		chai
			.request(app)
			.patch(`/user/${this.orgId}/${this.userId}`)
			.set("Authorization", "fakeToken")
			.send(formData)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "Invalid token");
				done();
			});
	});
	it("/task/:orgId/:taskId updates a task", (done) => {
		const taskData = {
			name: "Brushing your teeth",
		};
		chai
			.request(app)
			.patch(`/task/${this.orgId}/${this.taskId}`)
			.set("Authorization", this.testToken)
			.send(taskData)
			.end((err, res) => {
				assert.equal(res.body.tasks[0].name, "Brushing your teeth");
				assert.equal(res.status, 200);
				done();
			});
	});
	it("/task/:orgId/:taskId throws a 401 error if there is no token", (done) => {
		const taskData = {
			name: "Brushing your teeth",
		};
		chai
			.request(app)
			.patch(`/task/${this.orgId}/${this.taskId}`)
			.send(taskData)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "No token, authorization denied");
				done();
			});
	});
	it("/task/:orgId/:taskId throws a 401 error if the token is invalid", (done) => {
		const taskData = {
			name: "Brushing your teeth",
		};
		chai
			.request(app)
			.patch(`/task/${this.orgId}/${this.taskId}`)
			.set("Authorization", "fakeToken")
			.send(taskData)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "Invalid token");
				done();
			});
	});

	it(`/step/:taskId/:stepId updates a step`, (done) => {
		const stepData = {
			text: "Find your toothbrush",
		};
		chai
			.request(app)
			.patch(`/step/${this.taskId}/${this.stepId}`)
			.set("Authorization", this.testToken)
			.send(stepData)
			.end((err, res) => {
				assert.equal(res.body.steps[0].text, "Find your toothbrush");
				assert.equal(res.status, 200);
				done();
			});
	});
	it(`/step/:taskId/:stepId throws a 401 error if there is no token`, (done) => {
		const stepData = {
			text: "Find your toothbrush",
		};
		chai
			.request(app)
			.patch(`/step/${this.taskId}/${this.stepId}`)
			.send(stepData)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "No token, authorization denied");
				done();
			});
	});
	it(`/step/:taskId/:stepId throws a 401 error if the token is invalid`, (done) => {
		const stepData = {
			text: "Find your toothbrush",
		};
		chai
			.request(app)
			.patch(`/step/${this.taskId}/${this.stepId}`)
			.set("Authorization", "fakeToken")
			.send(stepData)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "Invalid token");
				done();
			});
	});
});
