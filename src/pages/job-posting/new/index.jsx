import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Step2 from "@/components/company/jobPosting/Step2";
import { ToastContainer } from "react-toastify";
import { useSession } from "next-auth/react";
import Image from "next/image";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";
import Loading from "@/components/widgets/Loading";

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
	const { _id } = router.query;

	const user = useLoggedUserQuery();

	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState(null);
	const [formErrors, setFormErrors] = useState({
		company: "",
		title: "",
		city: "",
		country: "",
		locationType: "",
		employmentType: "",
		description: "",
	});

	useEffect(() => {
		if (_id && user.data) {
			const page = user.data.adminPages.find((page) => page._id === _id);

			setFormData({
				company: _id,
				companyName: page?.name,
				companyUniqueAddress: page?.uniqueAddress,
				companyPicturePath: page?.picturePath,
				postedBy: user?.data?._id,
				title: "",
				city: "",
				country: "",
				locationType: locationTypeOptions[0].value,
				employmentType: employmentTypeOptions[0].value,
				description: "",
				skills: [],
			});
		} else if (user.data && !_id) {
			setFormData({
				company: user?.data?.adminPages[0]?._id,
				companyName: user?.data?.adminPages[0]?.name,
				companyUniqueAddress: user?.data?.adminPages[0]?.uniqueAddress,
				postedBy: user?.data?._id,
				title: "",
				city: "",
				country: "",
				locationType: locationTypeOptions[0].value,
				employmentType: employmentTypeOptions[0].value,
				description: "",
				skills: [],
			});
		}
	}, [user.data, _id]);

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

		if (!formData.country) {
			errors.country = "Country is required";
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

		if (name === "companyName") {
			const selectedPage = user?.data?.adminPages.find(
				(page) => page.name === value
			);
			if (selectedPage) {
				setFormData({
					...formData,
					company: selectedPage._id,
					companyName: value,
					companyUniqueAddress: selectedPage.uniqueAddress,
					companyPicturePath: selectedPage.picturePath,
				});
			}
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}

		setFormErrors({ ...formErrors, [name]: "" });
	};

	const handleDescriptionChange = (value) => {
		setFormData({ ...formData, description: value });
	};

	if (user.isLoading) return <Loading />;

	if (user.data)
		return (
			<div>
				{step === 1 && (
					<div className="flex justify-center items-center h-[48rem] pt-16 bg-slate-700">
						<div className="flex flex-col gap-2 w-96 bg-base-100 rounded-lg p-5">
							<div className="flex flex-col">
								<span className="text-xl font-semibold">
									Find a great hire, fast
								</span>
								<span className="text-sm">
									Rated #1 in increasing quality of hire.
								</span>
							</div>

							<div className="flex flex-col">
								<FormInput
									name="title"
									size="sm"
									title="Job title*"
									type="text"
									placeholder="Add the title you are hiring for"
									value={formData?.title}
									onChange={handleChange}
									error={formErrors.title}
								/>
								<div className="form-control w-full">
									<label className="label">
										<span className="label-text">Company</span>
									</label>
									<div
										className={`flex gap-1.5 ${
											formErrors.company
												? "tooltip tooltip-error tooltip-open tooltip-top"
												: null
										}`}
										data-tip={formErrors.company}
									>
										{user?.data?.adminPages
											?.filter((page) => page._id === formData?.company)
											.map((page) => (
												<Image
													src={
														page?.picturePath
															? page?.picturePath
															: "/company.png"
													}
													width={32}
													height={32}
													alt="company-logo"
													key={page._id}
												/>
											))}

										<div className="w-full">
											<select
												name="companyName"
												value={formData?.companyName}
												onChange={handleChange}
												className={`select select-bordered w-full select-sm font-normal`}
											>
												{user?.data?.adminPages?.map((page) => (
													<option key={page._id} value={page.name}>
														{page.name}
													</option>
												))}
											</select>
										</div>
									</div>
								</div>
								<FormSelect
									name="locationType"
									size="sm"
									title="Workplace Type"
									options={locationTypeOptions}
									onChange={handleChange}
									error={formErrors.location}
								/>
								<FormInput
									name="city"
									size="sm"
									title="City*"
									type="text"
									placeholder="Ex. Manila"
									value={formData?.city}
									onChange={handleChange}
									error={formErrors.city}
								/>
								<FormInput
									name="country"
									size="sm"
									title="Country*"
									type="text"
									placeholder="Ex. Philippines"
									value={formData?.country}
									onChange={handleChange}
									error={formErrors.country}
								/>
								<FormSelect
									name="employmentType"
									size="sm"
									title="Job Type"
									options={employmentTypeOptions}
									onChange={handleChange}
									error={formErrors.location}
								/>
							</div>
							<div className="pt-3">
								<button
									onClick={nextStep}
									className="bg-blue-600 w-full rounded-full py-2.5 my-2 text-xl text-white font-semibold"
								>
									Get started
								</button>
							</div>
						</div>
					</div>
				)}
				{step === 2 && (
					<Step2
						formData={formData}
						setFormData={setFormData}
						formErrors={formErrors}
						handleDescriptionChange={handleDescriptionChange}
						nextStep={nextStep}
						previousStep={previousStep}
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
