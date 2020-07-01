const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const compression = require("compression");
const enforce = require("express-sslify");
const path = require("path");

//create db connection
const db = require("./config/keys").mongoURI;

//require routes
const auth = require("./routes/auth");
// const organization = require("./routes/organization");
const user = require("./routes/user");
const task = require("./routes/task");
const step = require("./routes/step");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use("/auth", auth);
// app.use("/organization", organization);
app.use("/user", user);
app.use("/task", task);
app.use("/step", step);
app.use(enforce.HTTPS({ trustProtoHeader: true }));

mongoose
	.connect(db, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const port = 5000;

app.listen(process.env.PORT || port);

module.exports = app;
