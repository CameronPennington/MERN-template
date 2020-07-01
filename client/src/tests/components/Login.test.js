import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Login } from "../../components/Login";

describe("The Login component", () => {
	// beforeAll(() => {
	// 	const props = {
	// 		user: { isAuthenticated: false },
	// 	};
	// 	const component = render(<Login {...props} />);
	// 	return component;
	// });

	test("renders without crashing", () => {
		const props = {
			user: { isAuthenticated: false },
		};
		const { asFragment } = render(<Login {...props} />);
		expect(asFragment()).toMatchSnapshot();
	});

	test("handles email input", async () => {
		const props = {
			user: { isAuthenticated: false },
		};
		const { getByTestId } = render(<Login {...props} />);
		fireEvent.change(getByTestId("email"), {
			target: { id: "email", value: "john.doe@gmail.com" },
		});

		expect(getByTestId("email")).toHaveAttribute("value", "john.doe@gmail.com");
	});

	test("handles password input", () => {
		const props = {
			user: { isAuthenticated: false },
		};
		const { getByTestId } = render(<Login {...props} />);
		fireEvent.change(getByTestId("password"), {
			target: { id: "password", value: "password" },
		});

		expect(getByTestId("password")).toHaveAttribute("value", "password");
	});
	//check submission
	test("logs in user", () => {
		const logInUser = jest.fn();
		const props = {
			user: { isAuthenticated: false },
			logInUser,
		};

		const { getByTestId } = render(<Login {...props} />);
		fireEvent.change(getByTestId("email"), {
			target: { id: "email", value: "john.doe@gmail.com" },
		});

		fireEvent.change(getByTestId("password"), {
			target: { id: "password", value: "password" },
		});
		fireEvent.submit(getByTestId("form"));

		expect(props.logInUser).toHaveBeenCalled();
	});

	// test("clears values after form submission", () => {
	// 	const logInUser = jest.fn();
	// 	const props = {
	// 		user: { isAuthenticated: false },
	// 		logInUser,
	// 	};

	// 	const { getByTestId } = render(<Login {...props} />);
	// 	fireEvent.change(getByTestId("email"), {
	// 		target: { id: "email", value: "john.doe@gmail.com" },
	// 	});

	// 	fireEvent.change(getByTestId("password"), {
	// 		target: { id: "password", value: "password" },
	// 	});
	// 	fireEvent.submit(getByTestId("form")).then;
	// 	expect(getByTestId("email")).toHaveAttribute("value", "");
	// });
});

//Tests should be:
//clears values after submission
//shows error if email is blank
//shows error if password is blank
//shows error if email is invalid
//shows error if user is not found
