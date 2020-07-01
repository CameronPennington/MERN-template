const mongoose = require("mongoose");
const db = require("../config/keys").mongoURI;

mongoose.Promise = global.Promise;

before((done) => {
	mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
	mongoose.connection
		.once("open", () => {
			console.log("MongoDB Connected");
			done();
		})
		.on("error", (error) => {
			console.warn("Warning", error);
			done();
		});
});

afterEach(async () => {
	const {
		organizations,
		users,
		tasks,
		steps,
	} = mongoose.connection.collections;
	await organizations.deleteMany({});
	await users.deleteMany({});
	await tasks.deleteMany({});
	await steps.deleteMany({});
});
