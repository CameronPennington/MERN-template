const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = function (req, res, next) {
	const token = req.header("Authorization")
		? req.header("Authorization").slice(7)
		: null;

	if (!token) {
		return res.status(401).json({ message: "No token, authorization denied" });
	}
	try {
		const decoded = jwt.verify(token, keys.secretOrKey);

		req.user = decoded;

		next();
	} catch (err) {
		res.status(401).json({ message: "Invalid token" });
	}
};
