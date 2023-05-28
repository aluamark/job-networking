import React, { useState } from "react";
import { useRouter } from "next/router";
import { createJob } from "@/lib/helper";
import Step1 from "@/components/company/jobPosting/Step1";
import Step2 from "@/components/company/jobPosting/Step2";
import { toast, ToastContainer } from "react-toastify";
import { useSession } from "next-auth/react";

const locationTypeOptions = [
	{ value: "On-site", label: "On-site" },
	{ value: "Hybrid", label: "Hybrid" },
	{ value: "Remote", label: "Remote" },
];

const employmentTypeOptions = [
	{ value: "Full-time", label: "Full-time" },
	{ value: "Part-time", label: "Part-time" },
	{ value: "Contract", label: "Contract" },
	{ value: "Temporary", label: "Temporary" },
	{ value: "Internship", label: "Internship" },
	{ value: "Volunteer", label: "Volunteer" },
];

const PostJobForm = () => {
	const { data } = useSession();
	const router = useRouter();
	const company = router.query;

	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		company: company._id,
		postedBy: data?.user?._id,
		title: "",
		city: company.city,
		country: company.country,
		locationType: locationTypeOptions[0].value,
		employmentType: employmentTypeOptions[0].value,
		description: "",
		skills: [],
	});
	const [formErrors, setFormErrors] = useState({
		company: "",
		title: "",
		city: "",
		country: "",
		locationType: "",
		employmentType: "",
		description: "",
	});

	const nextStep = () => {
		const errors = {};

		if (!formData.title) {
			errors.title = "Job title is required";
		}

		if (!formData.company) {
			errors.company = "Company is required";
		}

		if (!formData.city) {
			errors.city = "City is required";
		}

		if (Object.keys(errors).length === 0) {
			setStep(2);
		} else {
			setFormErrors(errors);
		}
	};

	const previousStep = () => {
		setStep(1);
	};

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
		setFormErrors({ ...formErrors, [name]: "" });
	};

	const handleDescriptionChange = (value) => {
		setFormData({ ...formData, description: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const { message } = await createJob(formData);

			router.push(`/company/${company.uniqueAddress}`);
			toast.success(message);
		} catch (error) {
			toast.error(error?.response?.data?.error);
		}
	};

	return (
		<div>
			{step === 1 && (
				<Step1
					companyName={company.name}
					formData={formData}
					formErrors={formErrors}
					handleChange={handleChange}
					nextStep={nextStep}
					previousStep={previousStep}
					locationTypeOptions={locationTypeOptions}
					employmentTypeOptions={employmentTypeOptions}
				/>
			)}
			{step === 2 && (
				<Step2
					company={company}
					formData={formData}
					setFormData={setFormData}
					formErrors={formErrors}
					handleDescriptionChange={handleDescriptionChange}
					nextStep={nextStep}
					previousStep={previousStep}
					handleSubmit={handleSubmit}
				/>
			)}
			<ToastContainer
				position="bottom-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
			/>
		</div>
	);
};

export default PostJobForm;
