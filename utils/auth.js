const bcrypt = require("bcryptjs");

function getSalt() {
	return new Promise((res, rej) => {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) rej(err);
			else res(salt);
		});
	});
}

function getHash(stringToHash, salt) {
	return new Promise((res, rej) => {
		bcrypt.hash(stringToHash, salt, (err, hash) => {
			if (err) rej(err);
			else res(hash);
		});
	});
}

module.exports = {
	getSalt,
	getHash,
};
