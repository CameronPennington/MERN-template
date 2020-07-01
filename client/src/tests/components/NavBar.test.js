import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { NavBar } from "../../components/NavBar";

describe("The NavBar component", () => {
	test("should render logged out version without crashing", () => {
		const props = {
			user: { isAuthenticated: false },
		};
		const { asFragment } = render(
			<Router>
				<NavBar {...props} />
			</Router>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	test("should render logged in version without crashing", () => {
		const props = {
			user: {
				isAuthenticated: true,
				properties: {
					organization: "",
				},
			},
		};
		const { asFragment } = render(
			<Router>
				<NavBar {...props} />
			</Router>
		);
		expect(asFragment()).toMatchSnapshot();
	});
	test.skip("should navigate to login page", () => {
		const props = {
			user: { isAuthenticated: false },
		};
		const { asFragment } = render(
			<Router>
				<NavBar {...props} />
			</Router>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	test("should log out user", () => {
		const logOutUser = jest.fn();
		const props = {
			user: {
				isAuthenticated: true,
				properties: {
					organization: "",
				},
			},
			logOutUser,
		};
		const { getByTestId } = render(
			<Router>
				<NavBar {...props} />
			</Router>
		);
		fireEvent.click(getByTestId("logout"));
		expect(props.logOutUser).toHaveBeenCalled();
	});
});
