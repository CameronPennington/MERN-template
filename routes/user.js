const express = require("express");
const router = express.Router();
const auth = require("../utils/authMiddleware");
const User = require("../models/User");
const Organization = require("../models/Organization");

const getHash = require("../utils/auth").getHash;
const getSalt = require("../utils/auth").getSalt;

router.get("/:orgId", auth, async (req, res) => {
	//must explicitly return
	if (!req.user.admin) {
		return res.status(403).json({ message: "Admin access is required" });
	}
	try {
		const users = await User.find({ organization: req.params.orgId }).catch(
			(err) => {
				throw err;
			}
		);
		const resBody = { users };
		res.status(200).json(resBody);
	} catch (err) {
		throw err;
	}
});

router.post("/:orgId", auth, async (req, res) => {
	if (!req.user.admin) {
		return res.status(403).json({ message: "Admin access is required" });
	}
	try {
		const { firstName, lastName, email, password, admin } = req.body;

		const newUser = new User({
			firstName,
			lastName,
			email,
			password,
			admin,
		});

		const organization = await Organization.findById(req.params.orgId)
			.populate("users")
			.catch((err) => {
				throw err;
			});
		organization.users.push(newUser);
		newUser.organization = organization;

		const salt = await getSalt().catch((err) => {
			throw err;
		});

		const hashedPassword = await getHash(newUser.password, salt).catch(
			(err) => {
				throw err;
			}
		);

		newUser.password = hashedPassword;

		await newUser.save().catch((err) => {
			throw err;
		});
		await organization.save().catch((err) => {
			throw err;
		});
		const { users } = organization;

		const resBody = { users };

		res.status(200).json(resBody);
	} catch (err) {
		throw err;
	}
});

router.patch("/:orgId/:userId", auth, async (req, res) => {
	if (!req.user.admin) {
		return res.status(403).json({ message: "Admin access is required" });
	}
	try {
		const user = await User.findById(req.params.userId).catch((err) => {
			throw err;
		});

		if (req.body.firstName.length > 0) {
			user.firstName = req.body.firstName;
		}

		if (req.body.lastName.length > 0) {
			user.lastName = req.body.lastName;
		}

		if (req.body.email.length > 0) {
			user.email = req.body.email;
		}

		if (req.body.password.length > 0) {
			const salt = await getSalt();

			const hashedPassword = await getHash(req.body.password, salt);
			user.password = hashedPassword;
		}
		user.admin = req.body.admin;

		await user.save().catch((err) => {
			throw err;
		});

		const organization = await Organization.findById(req.params.orgId)
			.populate("users")
			.catch((err) => {
				throw err;
			});

		const { users } = organization;
		const resBody = { users };
		res.status(200).json(resBody);
	} catch (err) {
		throw err;
	}
});

router.delete("/:orgId/:userId", auth, async (req, res) => {
	if (!req.user.admin) {
		return res.status(403).json({ message: "Admin access is required" });
	}
	try {
		await User.findByIdAndDelete(req.params.userId).catch((err) => {
			throw err;
		});
		const organization = await Organization.findById(req.params.orgId)
			.populate("users")
			.catch((err) => {
				throw err;
			});
		const { users } = organization;
		const resBody = { users };
		res.status(200).json(resBody);
	} catch (err) {
		throw err;
	}
});

module.exports = router;
