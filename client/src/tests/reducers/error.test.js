import errorReducer from "../../reducers/errorReducer";
import error from "../fixtures/error";
import { GET_ERRORS } from "../../actions/types";

test("should set default error state", () => {
	const state = errorReducer(undefined, { type: "@@INIT" });
	expect(state).toEqual({
		message: "",
	});
});

test("should set error message", () => {
	const action = {
		type: GET_ERRORS,
		payload: error,
	};
	const initialState = {};
	const calculatedState = errorReducer(initialState, action);
	expect(calculatedState).toEqual({
		message: "There is an error",
	});
});
