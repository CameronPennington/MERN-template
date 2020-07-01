import axios from "axios";

//switched to promise syntax to work with IE

export const getOrg = (orgId) => {
	return new Promise((resolve, reject) => {
		axios
			.get(`/task/${orgId}/`)
			.then(({ data }) => resolve(data))
			.catch((err) => {
				reject({ message: "Something went wrong, please try again later." });
			});
	});
};

export const addTask = (orgId, taskData) => {
	return new Promise((resolve, reject) => {
		axios
			.post(`/task/${orgId}/`, taskData)
			.then(({ data }) => resolve(data))
			.catch((err) => {
				reject({ message: "Something went wrong, please try again later." });
			});
	});
};

export const deleteTask = (orgId, taskId) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(`/task/${orgId}/${taskId}`)
			.then(({ data }) => resolve(data))
			.catch((err) => {
				if (err.response.status === 404) {
					const { message } = err.response.data;
					reject({ message });
				} else {
					reject({ message: "Something went wrong, please try again later." });
				}
			});
	});
};

export const editTask = (orgId, taskId, taskData) => {
	return new Promise((resolve, reject) => {
		axios
			.patch(`/task/${orgId}/${taskId}`, taskData)
			.then(({ data }) => resolve(data))
			.catch((err) => {
				if (err.response.status === 404) {
					const { message } = err.response.data;
					reject({ message });
				} else {
					reject({ message: "Something went wrong, please try again later." });
				}
			});
	});
};
