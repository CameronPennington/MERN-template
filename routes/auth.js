const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const keys = require("../config/keys");
const getHash = require("../utils/auth").getHash;
const getSalt = require("../utils/auth").getSalt;

const User = require("../models/User");

router.post("/register", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email }).catch((err) => {
			throw err;
		});

		if (user) {
			return res
				.status(422)
				.json({ message: "A user with that email address already exists." });
		}

		const newUser = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
		});

		const salt = await getSalt().catch((err) => {
			throw err;
		});

		const hashedPassword = await getHash(newUser.password, salt).catch(
			(err) => {
				throw err;
			}
		);

		newUser.password = hashedPassword;
		newUser.admin = true;
		await newUser.save().catch((err) => {
			throw err;
		});

		const formattedUser = {
			id: newUser._id,
			firstName: newUser.firstName,
			lastName: newUser.lastName,
		};

		const token = jwt.sign(formattedUser, keys.secretOrKey, {
			expiresIn: 3600,
		});

		const userPayload = {
			success: true,
			token: "Bearer " + token,
		};

		res.status(200).json(userPayload);
	} catch (err) {
		throw err;
	}
});

router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email }).catch((err) => {
			throw err;
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const passwordsMatch = await bcrypt
			.compare(req.body.password, user.password)
			.catch((err) => {
				throw err;
			});

		if (!passwordsMatch) {
			return res.status(401).json({ message: "Incorrect password" });
		}

		await user.save().catch((err) => {
			throw err;
		});

		const formattedUser = {
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
		};

		const token = jwt.sign(formattedUser, keys.secretOrKey, {
			expiresIn: 3600,
		});

		const userPayload = {
			success: true,
			token: "Bearer " + token,
		};

		res.json(userPayload);
	} catch (err) {
		throw err;
	}
});

module.exports = router;
