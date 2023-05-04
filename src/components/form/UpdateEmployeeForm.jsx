import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getEmployee, updateEmployee } from "@/lib/helper";
import validateForm from "@/lib/validateForm";
import FormInput from "./FormInput";
import { toast } from "react-toastify";
import { PuffLoader } from "react-spinners";

const UpdateEmployeeForm = () => {
	const router = useRouter();
	const { employeeId } = router.query;
	const [loading, setLoading] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [employee, setEmployee] = useState(null);
	const [formErrors, setFormErrors] = useState({
		firstName: "",
		lastName: "",
		email: "",
		location: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;

		setEmployee({ ...employee, [name]: value });
		setFormErrors({ ...formErrors, [name]: "" });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitLoading(true);

		const errors = validateForm(employee);

		if (Object.keys(errors).length === 0) {
			const employeeData = new FormData();
			for (let data in employee) {
				employeeData.append(data, employee[data]);
			}

			try {
				const employee = await updateEmployee(employeeId, employeeData);
				const { updatedEmployee } = employee;
				toast.success(
					`Updated employee ${updatedEmployee.firstName} ${updatedEmployee.lastName} sucessfully`
				);

				router.replace("/dashboard");
			} catch (error) {
				console.log(error);
				toast.error(error.response.data.error);
			}
		} else {
			setFormErrors(errors);
		}
		setSubmitLoading(false);
	};

	const fetchEmployee = async (employeeId) => {
		setLoading(true);
		const employeeToUpdate = await getEmployee(employeeId);
		setEmployee(employeeToUpdate);
		setLoading(false);
	};

	useEffect(() => {
		if (employeeId) {
			fetchEmployee(employeeId);
		}
	}, [employeeId]);

	if (loading)
		return (
			<div className="border border-base-300 bg-base-100 rounded-box p-4">
				<div>Update Employee</div>
				<div className="pt-5">
					<div className="divider">Employee Information</div>
					<div className="flex justify-center py-5">
						<PuffLoader />
					</div>
				</div>
			</div>
		);

	return (
		<div className="border border-base-300 bg-base-100 rounded-box p-4">
			<div>Update Employee</div>
			<div className="divider">Employee Information</div>
			{employee && (
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col gap-3">
						<div className="flex gap-3">
							<FormInput
								name="firstName"
								title="First Name"
								type="text"
								placeholder="Enter first name"
								value={employee.firstName}
								onChange={handleChange}
								error={formErrors.firstName}
							/>
							<FormInput
								name="lastName"
								title="Last Name"
								type="text"
								placeholder="Enter last name"
								value={employee.lastName}
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
								value={employee.email}
								onChange={handleChange}
								error={formErrors.email}
							/>
							<FormInput
								name="location"
								title="Location"
								type="text"
								placeholder="Street, House #, City"
								value={employee.location}
								onChange={handleChange}
								error={formErrors.location}
							/>
						</div>
						<div className="pt-5 pb-3">
							{submitLoading ? (
								<button className="btn btn-success w-full loading"></button>
							) : (
								<button className="btn btn-success w-full">
									Update Employee
								</button>
							)}
						</div>
					</div>
				</form>
			)}
		</div>
	);
};

export default UpdateEmployeeForm;
