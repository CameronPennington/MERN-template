import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const composeWithDevTools =
	process.env.NODE_ENV !== "production"
		? require("redux-devtools-extension").composeWithDevTools
		: null;

const initialState = {};

const middleware = [thunk];

const middlewareBuild =
	process.env.NODE_ENV === "production"
		? applyMiddleware(...middleware)
		: composeWithDevTools(applyMiddleware(...middleware));

const store = createStore(rootReducer, initialState, middlewareBuild);

export default store;
