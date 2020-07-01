const express = require("express");
const router = express.Router();

const Organization = require("../models/Organization.js");

//not currently part of the app, but perhaps a later version
// router.get("/", async (req, res) => {
// 	const organizations = await Organization.find();
// 	res.status(200).json(organizations);
// });

// router.get("/:orgId", async (req, res) => {
// 	try {
// 		const organization = await Organization.findById(req.params.orgId).catch(
// 			(err) => {
// 				throw err;
// 			}
// 		);
// 		organization ? res.status(200).json(organization) : res.status(404).send();
// 	} catch (err) {
// 		res.status(err.status);
// 	}
// });

//not currently part of the app, but perhaps a later version
// router.post("/", async (req, res) => {
// 	try {
// 		const { name } = req.body;
// 		const newOrg = new Organization({ name });
// 		await newOrg.save().catch((err) => {
// 			throw err;
// 		});
// 		const organizations = await Organization.find();
// 		res.status(200).json(organizations);
// 	} catch (err) {
// 		res.status(err.status);
// 	}
// });

// router.patch("/:orgId", async (req, res) => {
// 	try {
// 		const organization = await Organization.findById(req.params.orgId).catch(
// 			(err) => {
// 				throw err;
// 			}
// 		);
// 		organization.name = req.body.name;
// 		await organization.save().catch((err) => {
// 			throw err;
// 		});
// 		res.status(200).send();
// 	} catch (err) {
// 		res.status(err.status);
// 	}
// });

//not currently part of the app, but perhaps a later version
// router.delete("/:orgId", async (req, res) => {
// 	try {
// 		await Organization.findByIdAndDelete(req.params.orgId).catch((err) => {
// 			throw err;
// 		});
// 		res.status(200).send();
// 	} catch (err) {
// 		res.status(err.status);
// 	}
// });

module.exports = router;
