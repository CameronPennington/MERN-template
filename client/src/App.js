import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import ReactTimeout from "react-timeout";
import store from "./store";
import Login from "./components/Login";
import Landing from "./components/Landing";
import NavBar from "./components/NavBar";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logOutUser } from "./actions/auth";

if (localStorage.jwtToken) {
	setAuthToken(localStorage.jwtToken);
	const decoded = jwt_decode(localStorage.jwtToken);

	store.dispatch(setCurrentUser(decoded));

	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		store.dispatch(logOutUser());
	}
}

function App(props) {
	return (
		<Provider store={store}>
			<Router>
				<div>
					<NavBar />
					<Route exact path="/" component={Landing} />
					<Route exact path="/login" component={Login} />
				</div>
			</Router>
		</Provider>
	);
}

export default ReactTimeout(App);
