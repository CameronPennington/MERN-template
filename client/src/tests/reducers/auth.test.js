import userReducer from "../../reducers/userReducer";
import user from "../fixtures/user";
import { SET_USER } from "../../actions/types";

test("should set default user state", () => {
	const state = userReducer(undefined, { type: "@@INIT" });
	expect(state).toEqual({
		isAuthenticated: false,
		properties: {},
	});
});

test("should set current user", () => {
	const action = {
		type: SET_USER,
		payload: user,
	};
	const initialState = {};
	const calculatedState = userReducer(initialState, action);
	expect(calculatedState).toEqual({
		isAuthenticated: true,
		properties: {
			id: 1,
			organization: 1,
			firstName: "John",
			lastName: "Doe",
		},
	});
});
