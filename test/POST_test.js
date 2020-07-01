const chai = require("chai");
const assert = require("chai").assert;
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const app = require("../server");
const getHash = require("../utils/auth").getHash;
const getSalt = require("../utils/auth").getSalt;

chai.use(chaiHttp);

describe("POST ", () => {
	beforeEach(async () => {
		const salt = await getSalt();
		const hashedPassword = await getHash("password", salt);

		const newOrg = new Organization({
			name: "Covington",
		});

		const newUser = new User({
			firstName: "Jane",
			lastName: "Doe",
			email: "jane.doe@email.com",
			password: hashedPassword,
		});

		const newTask = new Task({
			name: "Washing your car",
		});

		newOrg.tasks.push(newTask);
		newOrg.users.push(newUser);
		newUser.organization = newOrg;
		newTask.organization = newOrg;

		await newOrg.save();
		await newUser.save();
		await newTask.save();

		this.orgId = newOrg.id;
		this.taskId = newTask.id;

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

	it("/auth/register creates and returns a user", (done) => {
		const formData = {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@email.com",
			password: "password",
			organization: "Red Wolf Development",
		};

		chai
			.request(app)
			.post("/auth/register")
			.send(formData)
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.exists(res.body.token);
				done();
			});
	});
	it("/auth/login finds and returns a user", (done) => {
		const formData = {
			email: "jane.doe@email.com",
			password: "password",
		};

		chai
			.request(app)
			.post("/auth/login")
			.send(formData)
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.exists(res.body.token);
				done();
			});
	});
	it("/user/:orgId creates a new user and returns the full list", (done) => {
		const formData = {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@gmail.com",
			password: "password",
		};
		chai
			.request(app)
			.post(`/user/${this.orgId}`)
			.set("Authorization", this.testAdminToken)
			.send(formData)
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.lengthOf(res.body.users, 2);
				done();
			});
	});
	it("/user/:orgId throws a 403 error if the user is not an admin", (done) => {
		const formData = {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@gmail.com",
			password: "password",
		};
		chai
			.request(app)
			.post(`/user/${this.orgId}`)
			.set("Authorization", this.testToken)
			.send(formData)
			.end((err, res) => {
				assert.equal(res.status, 403);
				assert.equal(res.body.message, "Admin access is required");
				done();
			});
	});
	it("/user/:orgId throws a 401 error if there is no token", (done) => {
		const formData = {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@gmail.com",
			password: "password",
		};
		chai
			.request(app)
			.post(`/user/${this.orgId}`)
			.send(formData)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "No token, authorization denied");
				done();
			});
	});
	it("/user/:orgId throws a 401 error if the token is invalid", (done) => {
		const formData = {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@gmail.com",
			password: "password",
		};
		chai
			.request(app)
			.post(`/user/${this.orgId}`)
			.set("Authorization", "fakeToken")
			.send(formData)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "Invalid token");
				done();
			});
	});
	it("/task/:orgId adds a task", (done) => {
		const newTask = {
			name: "Brushing your teeth",
		};
		chai
			.request(app)
			.post(`/task/${this.orgId}`)
			.set("Authorization", this.testToken)
			.send(newTask)
			.end((err, res) => {
				assert.lengthOf(res.body.tasks, 2);
				assert.equal(res.status, 200);
				done();
			});
	});
	it("/task/:orgId throws a 401 error if there is no token", (done) => {
		const newTask = {
			name: "Brushing your teeth",
		};
		chai
			.request(app)
			.post(`/task/${this.orgId}`)
			.send(newTask)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "No token, authorization denied");
				done();
			});
	});
	it("/task/:orgId throws a 401 error if the token is invalid", (done) => {
		const newTask = {
			name: "Brushing your teeth",
		};
		chai
			.request(app)
			.post(`/task/${this.orgId}`)
			.set("Authorization", "fakeToken")
			.send(newTask)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "Invalid token");
				done();
			});
	});
	it("/step/:taskId adds a step", (done) => {
		const newStep = {
			text: "Find your car",
		};
		chai
			.request(app)
			.post(`/step/${this.taskId}`)
			.set("Authorization", this.testToken)
			.send(newStep)
			.end((err, res) => {
				assert.lengthOf(res.body.steps, 1);
				assert.equal(res.status, 200);
				done();
			});
	});
	it("/step/:taskId throws a 401 error if there is no token", (done) => {
		const newStep = {
			text: "Find your car",
		};
		chai
			.request(app)
			.post(`/step/${this.taskId}`)
			.send(newStep)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "No token, authorization denied");
				done();
			});
	});
	it("/step/:taskId throws a 401 error if the token is invalid", (done) => {
		const newStep = {
			text: "Find your car",
		};
		chai
			.request(app)
			.post(`/step/${this.taskId}`)
			.set("Authorization", "fakeToken")
			.send(newStep)
			.end((err, res) => {
				assert.equal(res.status, 401);
				assert.equal(res.body.message, "Invalid token");
				done();
			});
	});
});
