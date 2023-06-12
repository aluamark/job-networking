import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setOpenModal, setLoggedUser } from "@/redux/reducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "react-modal";
import { FaSpinner } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import FormInput from "@/components/form/FormInput";
import { addUserExperience } from "@/lib/helper";
import { ToastContainer, toast } from "react-toastify";

Modal.setAppElement("#root");

const AddExperienceModal = ({
	user,
	isOpen,
	setIsOpen,
	setEditProfileModal,
}) => {
	const dispatch = useDispatch();
	const [submitLoading, setSubmitLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		employmentType: "",
		company: "",
		location: "",
		locationType: "",
		startDateMonth: "",
		startDateYear: "",
		endDateMonth: "",
		endDateYear: "",
		description: "",
	});
	const [formErrors, setFormErrors] = useState({
		title: "",
		employmentType: "",
		company: "",
		location: "",
		locationType: "",
		startDateMonth: "",
		startDateYear: "",
		endDateMonth: "",
		endDateYear: "",
		description: "",
	});

	const currentYear = new Date().getFullYear();
	const years = Array.from(Array(100), (_, i) => currentYear - i);

	const queryClient = useQueryClient();
	const createUpdateMutation = useMutation({
		mutationFn: addUserExperience,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["loggedUser"],
			});
		},
	});

	const handleChange = (event) => {
		const { name, value } = event.target;

		if (name === "description") {
			if (value.length <= 2000) {
				setFormData({ ...formData, [name]: value });
				setFormErrors({ ...formErrors, [name]: "" });
			}
		} else {
			setFormData({ ...formData, [name]: value });
			setFormErrors({ ...formErrors, [name]: "" });
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitLoading(true);

		const errors = {};

		if (!formData.title) {
			errors.title = "Title is a required field";
		}

		if (!formData.company) {
			errors.company = "Company name is a required field";
		}

		if (!formData.startDateMonth || !formData.startDateYear) {
			errors.startDateMonth = "Start date is a required field";
		}

		if (formData.endDateMonth && !formData.endDateYear) {
			errors.endDateMonth = "Please enter complete month and year";
		}

		if (Object.keys(errors).length === 0) {
			dispatch(setOpenModal(false));

			const userData = new FormData();
			for (let data in formData) {
				userData.append(data, formData[data]);
			}

			try {
				createUpdateMutation.mutate(
					{
						userId: user._id,
						userExperience: userData,
					},
					{
						onSuccess: (response) => {
							const { message } = response.data;
							toast.success(message);
							setFormData({
								title: "",
								employmentType: "",
								company: "",
								location: "",
								locationType: "",
								startDateMonth: "",
								startDateYear: "",
								endDateMonth: "",
								endDateYear: "",
								description: "",
							});
							setSubmitLoading(false);
							setIsOpen(false);
						},
					}
				);
			} catch (error) {
				toast.error(error?.response?.data?.error);
				setSubmitLoading(false);
			}
		} else {
			setFormErrors(errors);
			setSubmitLoading(false);
		}
	};

	const closeModal = () => {
		setEditProfileModal(true);
		setIsOpen(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			overlayClassName="fixed inset-0 bg-black/75"
			className="min-h-screen h-screen flex justify-center items-center"
		>
			<div className="bg-base-100 rounded-lg w-[550px] h-[79.2%]">
				<form onSubmit={handleSubmit} className="flex flex-col h-full">
					<div className="flex justify-between items-center py-3 pl-7 pr-3">
						<h3 className="text-lg font-semibold">Add experience</h3>
						<button
							onClick={closeModal}
							className="rounded-full hover:bg-base-300 cursor-pointer"
						>
							<MdClose className="w-7 h-7 m-1" />
						</button>
					</div>

					<div className="flex flex-col gap-5 border-y border-base-300 px-7 pb-1 overflow-y-auto">
						<div className="flex flex-col">
							<div className="pt-1">
								<span className="text-xs text-zinc-500">
									* Indicates required
								</span>
							</div>
							<FormInput
								name="title"
								size="sm"
								title="Title*"
								type="text"
								placeholder="Ex. Retail Sales Manager"
								value={formData.title}
								onChange={handleChange}
								error={formErrors.title}
							/>

							<div className="form-control w-full">
								<label className="label">
									<span className="label-text">Employment type</span>
								</label>
								<select
									name="employmentType"
									onChange={handleChange}
									className="select select-bordered select-sm font-normal"
									defaultValue={formData.employmentType}
								>
									<option value="">Please select</option>
									<option value="Full-time">Full-time</option>
									<option value="Part-time">Part-time</option>
									<option value="Self-employed">Self-employed</option>
									<option value="Freelance">Freelance</option>
									<option value="Contract">Contract</option>
									<option value="Internship">Internship</option>
								</select>
							</div>
							<FormInput
								name="company"
								size="sm"
								title="Company name*"
								type="text"
								placeholder="Ex. Google"
								value={formData.companyName}
								onChange={handleChange}
								error={formErrors.companyName}
							/>
							<FormInput
								name="location"
								size="sm"
								title="Location"
								type="text"
								placeholder="Ex. Manila, Philippines"
								value={formData.location}
								onChange={handleChange}
								error={formErrors.location}
							/>
							<div className="form-control w-full">
								<label className="label">
									<span className="label-text">Location type</span>
								</label>
								<select
									name="locationType"
									onChange={handleChange}
									className="select select-bordered select-sm font-normal w-full"
									defaultValue={formData.locationType}
								>
									<option value="">Please select</option>
									<option value="On-site">On-site</option>
									<option value="Hybrid">Hybrid</option>
									<option value="Remote">Remote</option>
								</select>
								<label className="label">
									<span className="label-text-alt text-zinc-500">
										Pick a location type (ex: remote)
									</span>
								</label>
							</div>
							<div className="flex items-end gap-3">
								<div className="form-control w-full">
									<label className="label">
										<span className="label-text">Start date*</span>
									</label>
									<div
										className={`${
											formErrors.startDateMonth
												? "tooltip tooltip-error tooltip-open tooltip-top"
												: null
										}`}
										data-tip={formErrors.startDateMonth}
									>
										<select
											name="startDateMonth"
											onChange={handleChange}
											className="select select-bordered select-sm font-normal w-full"
											defaultValue={formData.locationType}
										>
											<option value="">Month</option>
											<option value="January">January</option>
											<option value="February">February</option>
											<option value="March">March</option>
											<option value="April">April</option>
											<option value="May">May</option>
											<option value="June">June</option>
											<option value="July">July</option>
											<option value="August">August</option>
											<option value="September">September</option>
											<option value="October">October</option>
											<option value="November">November</option>
											<option value="December">December</option>
										</select>
									</div>
								</div>
								<div className="form-control w-full">
									<select
										name="startDateYear"
										onChange={handleChange}
										className="select select-bordered select-sm font-normal"
										defaultValue={formData.locationType}
									>
										<option value="">Year</option>
										{years.map((year) => (
											<option key={year} value={year}>
												{year}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="flex items-end gap-3">
								<div className="form-control w-full">
									<label className="label">
										<span className="label-text">End date</span>
									</label>
									<select
										name="endDateMonth"
										onChange={handleChange}
										className="select select-bordered select-sm font-normal w-full"
										defaultValue={formData.locationType}
									>
										<option value="">Month</option>
										<option value="January">January</option>
										<option value="February">February</option>
										<option value="March">March</option>
										<option value="April">April</option>
										<option value="May">May</option>
										<option value="June">June</option>
										<option value="July">July</option>
										<option value="August">August</option>
										<option value="September">September</option>
										<option value="October">October</option>
										<option value="November">November</option>
										<option value="December">December</option>
									</select>
								</div>
								<div className="form-control w-full">
									<select
										name="endDateYear"
										onChange={handleChange}
										className="select select-bordered select-sm font-normal"
										defaultValue={formData.locationType}
									>
										<option value="">Year</option>
										{years.map((year) => (
											<option key={year} value={year}>
												{year}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Description</span>
								</label>
								<textarea
									name="description"
									onChange={handleChange}
									className="textarea textarea-bordered textarea-sm"
									value={formData?.description}
								></textarea>
								<label className="label">
									<span className="label-text-alt"></span>
									<span
										className={`label-text-alt ${
											formData?.description.length === 2000
												? "text-red-500"
												: null
										}`}
									>
										{formData?.description.length}/2000
									</span>
								</label>
							</div>
						</div>
					</div>
					<div className="flex-none items-center px-5 py-3">
						{submitLoading ? (
							<button
								className="flex ml-auto px-6 py-1 rounded-full bg-blue-800 border text-white font-bold"
								disabled
							>
								<FaSpinner className="w-6 h-6 animate-spin" />
							</button>
						) : (
							<button
								type="submit"
								className="flex ml-auto px-5 py-1 rounded-full bg-blue-700 hover:bg-blue-800 border text-white font-bold"
							>
								Save
							</button>
						)}
					</div>
				</form>
			</div>
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
		</Modal>
	);
};

export default AddExperienceModal;
