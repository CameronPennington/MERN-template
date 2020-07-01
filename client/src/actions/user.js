import axios from "axios";

export const getUsers = (orgId) => {
	return new Promise((resolve, reject) => {
		axios
			.get(`/user/${orgId}`)
			.then(({ data }) => resolve(data))
			.catch((err) => {
				if (err.response.status === 403) {
					const { message } = err.response.data;
					reject({ message });
				} else {
					reject({ message: "Something went wrong, please try again later." });
				}
			});
	});
};

export const addUser = (orgId, userData) => {
	return new Promise((resolve, reject) => {
		axios
			.post(`/user/${orgId}`, userData)
			.then(({ data }) => resolve(data))
			.catch((err) => {
				if (err.response.status === 403) {
					const { message } = err.response.data;
					reject({ message });
				} else {
					reject({ message: "Something went wrong, please try again later." });
				}
			});
	});
};

export const editUser = (orgId, userId, userData) => {
	return new Promise((resolve, reject) => {
		axios
			.patch(`/user/${orgId}/${userId}`, userData)
			.then(({ data }) => resolve(data))
			.catch((err) => {
				if (err.response.status === 403) {
					const { message } = err.response.data;
					reject({ message });
				} else {
					reject({ message: "Something went wrong, please try again later." });
				}
			});
	});
};

export const deleteUser = (orgId, userId) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(`/user/${orgId}/${userId}`)
			.then(({ data }) => resolve(data))
			.catch((err) => {
				if (err.response.status === 403) {
					const { message } = err.response.data;
					reject({ message });
				} else {
					reject({ message: "Something went wrong, please try again later." });
				}
			});
	});
};
