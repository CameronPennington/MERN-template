const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const cloudConfig = {
	cloud_name: "hdey0kiko",
	api_key: 684523914465663,
	api_secret: "m1DvjUxTeVBGXGlh2l5XTZ0q5Pg",
};

let streamUpload = (req) => {
	return new Promise((resolve, reject) => {
		let stream = cloudinary.uploader.upload_stream(
			cloudConfig,
			(error, result) => {
				if (result) {
					resolve(result);
				} else {
					reject(error);
				}
			}
		);

		streamifier.createReadStream(req.file.buffer).pipe(stream);
	});
};

const uploadMedia = async (req) => {
	let result = await streamUpload(req);
	return result;
};

const deleteMedia = (imageId) => {
	return new Promise((resolve, reject) => {
		try {
			cloudinary.uploader.destroy(imageId, cloudConfig);
			resolve("OK");
		} catch (err) {
			reject(err);
		}
	});
};

module.exports = { uploadMedia, deleteMedia };
