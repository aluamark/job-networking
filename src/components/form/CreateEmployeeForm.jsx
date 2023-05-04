import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCreateEmployee } from "@/redux/reducer";
import { createEmployee } from "@/lib/helper";
import validateForm from "@/lib/validateForm";
import { toast } from "react-toastify";
import FormInput from "./FormInput";
import { useRouter } from "next/router";

const CreateEmployeeForm = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const [submitLoading, setSubmitLoading] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		location: "",
	});
	const [formErrors, setFormErrors] = useState({
		firstName: "",
		lastName: "",
		email: "",
		location: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
		setFormErrors({ ...formErrors, [name]: "" });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitLoading(true);

		const errors = validateForm(formData);

		if (Object.keys(errors).length === 0) {
			const employeeData = new FormData();
			for (let data in formData) {
				employeeData.append(data, formData[data]);
			}

			try {
				const employee = await createEmployee(employeeData);
				dispatch(setCreateEmployee(employee));
				toast.success(
					`Created employee ${employee.firstName} ${employee.lastName} sucessfully`
				);

				router.push("/dashboard");
			} catch (error) {
				toast.error(error.response.data.error);
			}
		} else {
			setFormErrors(errors);
		}
		setSubmitLoading(false);
	};

	return (
		<div className="border border-base-300 bg-base-100 rounded-box p-4">
			<div>Create Employee</div>
			<div className="divider">Employee Information</div>
			<form onSubmit={handleSubmit}>
				<div>
					<div className="flex gap-3">
						<FormInput
							name="firstName"
							title="First Name"
							type="text"
							placeholder="Enter first name"
							value={formData.firstName}
							onChange={handleChange}
							error={formErrors.firstName}
						/>
						<FormInput
							name="lastName"
							title="Last Name"
							type="text"
							placeholder="Enter last name"
							value={formData.lastName}
							onChange={handleChange}
							error={formErrors.lastName}
						/>
					</div>

					<div className="flex flex-col md:flex-row gap-3">
						<FormInput
							name="email"
							title="Email"
							type="email"
							placeholder="sample_email@company.com"
							value={formData.email}
							onChange={handleChange}
							error={formErrors.email}
						/>
						<FormInput
							name="location"
							title="Location"
							type="text"
							placeholder="Street, House #, City"
							value={formData.location}
							onChange={handleChange}
							error={formErrors.location}
						/>
					</div>
					<div className="pt-5 pb-3">
						{submitLoading ? (
							<button className="btn btn-success w-full loading"></button>
						) : (
							<button className="btn btn-success w-full">
								Create Employee
							</button>
						)}
					</div>
				</div>
			</form>
		</div>
	);
};

export default CreateEmployeeForm;
