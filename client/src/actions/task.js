import axios from "axios";

export const getSteps = (taskId) => {
	return new Promise((resolve, reject) => {
		axios
			.get(`/step/${taskId}`)
			.then(({ data }) => resolve(data))
			.catch((err) => {
				reject({ message: "Something went wrong, please try again later." });
			});
	});
};

export const addStep = (taskId, stepData) => {
	return new Promise((resolve, reject) => {
		axios
			.post(`/step/${taskId}/`, stepData)
			.then(({ data }) => resolve(data))
			.catch((err) => {
				if (err.response.status === 413) {
					const { message } = err.response.data;
					reject({ message });
				} else {
					reject({ message: "Something went wrong, please try again later." });
				}
			});
	});
};

export const editStep = (taskId, stepId, stepData) => {
	return new Promise((resolve, reject) => {
		axios
			.patch(`/step/${taskId}/${stepId}`, stepData)
			.then(({ data }) => resolve(data))
			.catch((err) => {
				if (err.response.status === 413) {
					const { message } = err.response.data;
					reject({ message });
				} else {
					reject({ message: "Something went wrong, please try again later." });
				}
			});
	});
};

export const deleteStep = (taskId, stepId) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(`/step/${taskId}/${stepId}`)
			.then(({ data }) => resolve(data))
			.catch((err) => {
				reject({ message: "Something went wrong, please try again later." });
			});
	});
};
