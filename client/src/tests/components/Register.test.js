import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Register } from "../../components/Register";

describe("The Register component", () => {
	test("renders without crashing", () => {
		const { asFragment } = render(<Register />);
		expect(asFragment()).toMatchSnapshot();
	});

	test("handles firstName input", () => {
		const { getByTestId } = render(<Register />);
		fireEvent.change(getByTestId("firstName"), {
			target: { id: "firstName", value: "John" },
		});
		expect(getByTestId("firstName")).toHaveAttribute("value", "John");
	});
	test("handles lastName input", () => {
		const { getByTestId } = render(<Register />);
		fireEvent.change(getByTestId("lastName"), {
			target: { id: "lastName", value: "Doe" },
		});
		expect(getByTestId("lastName")).toHaveAttribute("value", "Doe");
	});
	test("handles email input", () => {
		const { getByTestId } = render(<Register />);
		fireEvent.change(getByTestId("email"), {
			target: { id: "email", value: "john.doe@gmail.com" },
		});
		expect(getByTestId("email")).toHaveAttribute("value", "john.doe@gmail.com");
	});
	test("handles organization input", () => {
		const { getByTestId } = render(<Register />);
		fireEvent.change(getByTestId("organization"), {
			target: { id: "organization", value: "Red Wolf Development" },
		});
		expect(getByTestId("organization")).toHaveAttribute(
			"value",
			"Red Wolf Development"
		);
	});
	test("handles password input", () => {
		const { getByTestId } = render(<Register />);
		fireEvent.change(getByTestId("password"), {
			target: { id: "password", value: "password" },
		});
		expect(getByTestId("password")).toHaveAttribute("value", "password");
	});
	test("handles password2 input", () => {
		const { getByTestId } = render(<Register />);
		fireEvent.change(getByTestId("password2"), {
			target: { id: "password2", value: "password2" },
		});
		expect(getByTestId("password2")).toHaveAttribute("value", "password2");
	});

	test("registers a user", () => {
		const registerUser = jest.fn();
		const props = {
			registerUser,
		};

		const { getByTestId } = render(<Register {...props} />);
		fireEvent.change(getByTestId("firstName"), {
			target: { id: "firstName", value: "John" },
		});
		fireEvent.change(getByTestId("lastName"), {
			target: { id: "lastName", value: "Doe" },
		});
		fireEvent.change(getByTestId("organization"), {
			target: { id: "organization", value: "Red Wolf Development" },
		});
		fireEvent.change(getByTestId("email"), {
			target: { id: "email", value: "john.doe@gmail.com" },
		});

		fireEvent.change(getByTestId("password"), {
			target: { id: "password", value: "password" },
		});
		fireEvent.change(getByTestId("password2"), {
			target: { id: "password2", value: "password" },
		});
		fireEvent.submit(getByTestId("form"));

		expect(props.registerUser).toHaveBeenCalled();
	});
});
