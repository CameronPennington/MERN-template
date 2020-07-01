import React, { useEffect } from "react";
import {
	render,
	fireEvent,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import { Admin } from "../../components/Admin";

describe("The admin component", () => {
	test("should render without crashing", () => {
		const props = {
			user: {
				isAuthenticated: true,
				properties: {
					organization: 1,
				},
			},
		};
		const { asFragment } = render(<Admin {...props} />);
		expect(asFragment()).toMatchSnapshot();
	});
});
