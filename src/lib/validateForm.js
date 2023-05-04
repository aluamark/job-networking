export default function validateForm(data) {
	const errors = {};

	if (!data.firstName) {
		errors.firstName = "Required";
	}

	if (!data.lastName) {
		errors.lastName = "Required";
	}

	if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
		errors.email = "Please enter a valid email address";
	}

	if (!data.location) {
		errors.location = "Required";
	}

	return errors;
}
