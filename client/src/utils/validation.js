const isValidEmail = (email) => {
	return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

const passwordsMatch = (password, password2) => {
	if (password === password2) return true;
	else return false;
};

export function validateRegisterData(formData) {
	const {
		firstName,
		lastName,
		email,
		organization,
		password,
		password2,
	} = formData;
	let errors = {};

	if (
		password.length > 0 &&
		password2.length > 0 &&
		!passwordsMatch(password, password2)
	) {
		errors.password2 = "Passwords must match";
	}

	if (!isValidEmail(email)) {
		errors.email = "Invalid email";
	}

	if (firstName.length === 0) {
		errors.firstName = "First name is required";
	}
	if (lastName.length === 0) {
		errors.lastName = "Last name is required";
	}
	if (email.length === 0) {
		errors.email = "Email is required";
	}
	if (organization.length === 0) {
		errors.organization = "Organization is required";
	}
	if (password.length === 0) {
		errors.password = "Password is required";
	}
	if (password2.length === 0) {
		errors.password2 = "Please confirm password";
	}
	return errors;
}

export function validateLoginData(formData) {
	const { email, password } = formData;
	let errors = {};

	if (!isValidEmail(email)) {
		errors.email = "Invalid email";
	}

	if (password.length === 0) {
		errors.password = "Password is required";
	}

	if (email.length === 0) {
		errors.email = "Email is required";
	}

	return errors;
}

export function validateUserData(formData) {
	const { firstName, lastName, email, password, password2 } = formData;
	let errors = {};

	if (
		password.length > 0 &&
		password2.length > 0 &&
		!passwordsMatch(password, password2)
	) {
		errors.password2 = "Passwords must match";
	}

	if (!isValidEmail(email)) {
		errors.email = "Invalid email";
	}

	if (firstName.length === 0) {
		errors.firstName = "First name is required";
	}
	if (lastName.length === 0) {
		errors.lastName = "Last name is required";
	}
	if (email.length === 0) {
		errors.email = "Email is required";
	}

	if (password.length === 0) {
		errors.password = "Password is required";
	}
	if (password2.length === 0) {
		errors.password2 = "Please confirm password";
	}
	return errors;
}

export function validateEditUserData(formData) {
	const { firstName, lastName, email, password } = formData;
	let errors = {};

	if (email && !isValidEmail(email)) {
		errors.email = "Invalid email";
	}

	if (firstName && firstName.length === 0) {
		errors.firstName = "First name is required";
	}
	if (lastName && lastName.length === 0) {
		errors.lastName = "Last name is required";
	}
	if (email && email.length === 0) {
		errors.email = "Email is required";
	}

	if (password && password.length === 0) {
		errors.password = "Password is required";
	}

	return errors;
}
