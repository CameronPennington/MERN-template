import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { setCurrentUser, registerUser, logInUser } from "../../actions/auth";
import { SET_USER } from "../../actions/types";

test("should build user object", () => {
	const userData = {
		firstName: "John",
		lastName: "Doe",
		email: "john.doe@gmail.com",
		organization: "Red Wolf Development",
	};
	const action = setCurrentUser(userData);
	expect(action).toEqual({
		type: SET_USER,
		payload: {
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@gmail.com",
			organization: "Red Wolf Development",
		},
	});
});
