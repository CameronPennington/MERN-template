import isEmpty from "../utils/isEmpty";

import { SET_USER } from "../actions/types";

const initialState = {
	isAuthenticated: false,
	properties: {},
};

export default function (state = initialState, { type, payload }) {
	switch (type) {
		case SET_USER:
			return {
				...state,
				isAuthenticated: !isEmpty(payload),
				properties: payload,
			};
		default:
			return state;
	}
}
