import axios from "axios";
import jwt_decode from "jwt-decode";

const axiosInterceptor = () => {
	axios.interceptors.request.use(
		config => {
			if (localStorage.getItem("jwtToken")) {
				const splitToken = localStorage.getItem("jwtToken").split(" ");
				const token = splitToken[1];
				const decoded = jwt_decode(token);

				if (Date.now() / 1000 > decoded.exp) {
					//
				}
			}

			//check refreshToken
			//set new token in localstorage
			//store refreshtoken in localStorage too
			//find refreshToken by id and replace

			// console.log(Date.now() / 1000);

			return config;
		},
		error => {
			// Do something with request error
			return Promise.reject(error);
		}
	);
};

export default axiosInterceptor;
