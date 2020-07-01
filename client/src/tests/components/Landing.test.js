import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Landing } from "../../components/Landing";

describe.skip("The Landing component", () => {
	test("renders without crashing", () => {
		const { asFragment } = render(<Landing />);
		expect(asFragment()).toMatchSnapshot();
	});
});
