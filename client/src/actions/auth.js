import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { SET_USER, SET_ERRORS } from "./types";

import { setErrors } from "./error";

// axiosInterceptor();

export const registerUser = (formData) => (dispatch) => {
	axios
		.post("/auth/register/", formData)
		.then((res) => {
			//do stuff with token
			const { token } = res.data;
			localStorage.setItem("jwtToken", token);
			setAuthToken(token);
			const decoded = jwt_decode(token);
			dispatch(setCurrentUser(decoded));
		})
		.catch((err) => {
			const { message } = err.response.data;
			const errors = { message };
			dispatch(setErrors(errors));
		});
};

export const logInUser = (formData) => (dispatch) => {
	axios
		.post("/auth/login/", formData)
		.then((res) => {
			//do stuff with token
			const { token } = res.data;
			localStorage.setItem("jwtToken", token);
			setAuthToken(token);
			const decoded = jwt_decode(token);
			dispatch(setCurrentUser(decoded));
		})
		.catch((err) => {
			// console.log(err.response.data.message);
			// console.log(err.response.status)
			const { message } = err.response.data;
			const errors = { message };
			dispatch(setErrors(errors));
		});
};

export const logOutUser = () => (dispatch) => {
	localStorage.removeItem("jwtToken");
	setAuthToken(false);
	window.location.href = "/login";

	dispatch(setCurrentUser({}));
};

export const setCurrentUser = (decoded) => {
	return {
		type: SET_USER,
		payload: decoded,
	};
};
