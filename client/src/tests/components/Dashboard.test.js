import React, { useEffect } from "react";
import {
	render,
	fireEvent,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import { Dashboard } from "../../components/Dashboard";

describe("The Dashboard component", () => {
	test("should render without crashing", () => {
		//since getOrg is async, mock function must have a callback function that returns a resolved promise
		const getOrg = jest.fn(() => Promise.resolve({ data: { taskList: [] } }));
		const props = {
			user: {
				isAuthenticated: true,
				properties: {
					organization: 1,
				},
			},
		};
		const { asFragment } = render(<Dashboard {...props} getOrg={getOrg} />);
		expect(asFragment()).toMatchSnapshot();
	});

	test.skip("should call getOrg", async () => {
		//need to spy?
		jest.spyOn(React, "useEffect").mockImplementation((f) => f());
		const getOrg = jest.fn(() => Promise.resolve({ data: { taskList: [] } }));
		const props = {
			user: {
				isAuthenticated: true,
				properties: {
					organization: 1,
				},
			},
		};
		const { asFragment } = render(<Dashboard {...props} getOrg={getOrg} />);
		expect(getOrg).toHaveBeenCalledTimes(1);
	});

	test("clicking the add task button opens the dialog", () => {
		const getOrg = jest.fn(() => Promise.resolve({ data: { taskList: [] } }));
		//clicking add task opens dialog
		const props = {
			user: {
				isAuthenticated: true,
				properties: {
					organization: 1,
				},
			},
		};
		const component = render(<Dashboard {...props} getOrg={getOrg} />);
		const { getByTestId } = component;
		fireEvent.click(getByTestId("add-task"));
		expect(getByTestId("add-new-task")).toBeInTheDocument();
	});

	test.skip("input for add task dialog works", () => {
		const getOrg = jest.fn(() => Promise.resolve({ data: { taskList: [] } }));
		//clicking add task opens dialog

		const props = {
			user: {
				isAuthenticated: true,
				properties: {
					organization: 1,
				},
			},
		};
		const component = render(<Dashboard {...props} getOrg={getOrg} />);
		const { getByTestId } = component;
		fireEvent.click(getByTestId("add-task"));
		fireEvent.change(getByTestId("name"), {
			target: {
				value: "Brushing your teeth",
			},
		});
		expect(getByTestId("name")).toHaveAttribute("value", "Brushing your teeth");
	});

	test.skip("cancel button closes the add task dialog", async () => {
		const props = {
			user: {
				isAuthenticated: true,
				properties: {
					organization: 1,
				},
			},
		};
		const component = render(<Dashboard {...props} />);
		const { getByTestId } = component;

		fireEvent.click(getByTestId("add-task"));
		fireEvent.click(getByTestId("cancel-add-task"));
		waitForElementToBeRemoved(getByTestId("add-new-task"))
			.then(() => {
				expect(getByTestId("add-new-task")).not.toBeInTheDocument();
			})
			.catch((err) => null);
	});

	test.skip("test taskList", () => {
		const props = {
			user: {
				isAuthenticated: true,
				properties: {
					organization: 1,
				},
			},
		};
		const setTaskList = jest.fn();
		setTaskList.mockReturnValueOnce([{ name: "Brushing your teeth" }]);
		const component = render(
			<Dashboard {...props} setTaskList={setTaskList} />
		);

		const { getByTestId } = component;
		component.debug();
		fireEvent.click(getByTestId("add-task"));
		fireEvent.click(getByTestId("cancel-add-task"));
	});
});
