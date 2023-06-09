import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setOpenModal } from "@/redux/reducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCompany } from "@/lib/helper";
import Modal from "react-modal";
import { FaSpinner } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import FormInput from "@/components/form/FormInput";
import { ToastContainer, toast } from "react-toastify";

Modal.setAppElement("#root");

const EditPageModal = ({ company, isOpen, setIsOpen }) => {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	const [submitLoading, setSubmitLoading] = useState(false);
	const [formData, setFormData] = useState(null);
	const [formErrors, setFormErrors] = useState({
		name: "",
		industry: "",
		tagline: "",
		about: "",
		city: "",
		country: "",
		website: "",
		founded: "",
	});

	const createUpdateMutation = useMutation({
		mutationFn: updateCompany,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["companyProfile"],
			});
		},
	});

	const handleChange = (event) => {
		const { name, value } = event.target;

		if (name === "about") {
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

		const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
		const errors = {};

		if (!formData.name) {
			errors.name = "First name is a required field";
		}

		if (!formData.industry) {
			errors.industry = "Last name is a required field";
		}

		if (formData.website && !urlPattern.test(formData.website)) {
			errors.website = "Please enter a valid website";
		}

		if (Object.keys(errors).length === 0) {
			dispatch(setOpenModal(false));

			const companyData = new FormData();
			for (let data in formData) {
				companyData.append(data, formData[data]);
			}

			try {
				createUpdateMutation.mutate(
					{
						uniqueAddress: company.uniqueAddress,
						companyData,
					},
					{
						onSuccess: (response) => {
							const { message } = response.data;
							toast.success(message);
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
		dispatch(setOpenModal(false));
		setIsOpen(false);
	};

	useEffect(() => {
		if (company) {
			setFormData({
				name: company.name,
				industry: company.industry,
				tagline: company.tagline,
				about: company.about,
				city: company.city,
				country: company.country,
				website: company.website,
				founded: company.founded,
			});
		}
	}, [company]);

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			overlayClassName="fixed inset-0 bg-black/75"
			className="min-h-screen h-screen flex justify-center items-center"
		>
			<div className="bg-base-100 rounded-lg w-[550px] h-[80%]">
				<form onSubmit={handleSubmit} className="flex flex-col h-full">
					<div className="flex justify-between items-center py-3 pl-7 pr-3">
						<h3 className="text-lg font-semibold">Edit company intro</h3>
						<button
							onClick={closeModal}
							className="rounded-full hover:bg-base-300 cursor-pointer"
						>
							<MdClose className="w-7 h-7 m-1" />
						</button>
					</div>

					<div className="flex flex-col border-y border-base-300 px-7 pb-7 h-[90%] overflow-y-auto">
						<div className="flex flex-col">
							<div className="pt-1">
								<span className="text-xs text-zinc-500">
									* Indicates required
								</span>
								<h3 className="text-lg font-semibold">
									Details of your company
								</h3>
							</div>
							<FormInput
								name="name"
								size="sm"
								title="Company name*"
								type="text"
								placeholder="Company name"
								value={formData?.name}
								onChange={handleChange}
								error={formErrors.name}
							/>
							<FormInput
								name="industry"
								size="sm"
								title="Industry*"
								type="text"
								placeholder="Company industry"
								value={formData?.industry}
								onChange={handleChange}
								error={formErrors.industry}
							/>
							<FormInput
								name="tagline"
								size="sm"
								title="Tagline"
								type="text"
								placeholder="Company tagline"
								value={formData?.tagline}
								onChange={handleChange}
								error={formErrors.tagline}
							/>
							<FormInput
								name="website"
								size="sm"
								title="Website"
								type="text"
								placeholder="Ex. https://companyname.com"
								value={formData?.website}
								onChange={handleChange}
								error={formErrors.website}
							/>
							<FormInput
								name="founded"
								size="sm"
								title="Founded"
								type="text"
								placeholder="Year your company was founded"
								value={formData?.founded}
								onChange={handleChange}
								error={formErrors.founded}
							/>
							<div className="form-control">
								<label className="label">
									<span className="label-text">About</span>
								</label>
								<textarea
									name="about"
									onChange={handleChange}
									className="textarea textarea-bordered textarea-sm"
									placeholder="What is your company's business/achievements/history"
									value={formData?.about}
								></textarea>
								<label className="label">
									<span className="label-text-alt"></span>
									<span
										className={`label-text-alt ${
											formData?.about.length === 2000 ? "text-red-500" : null
										}`}
									>
										{formData?.about.length}/2000
									</span>
								</label>
							</div>
						</div>

						<div className="flex flex-col">
							<h3 className="text-lg font-semibold">Location</h3>
							<FormInput
								name="city"
								size="sm"
								title="City"
								type="text"
								placeholder="Ex. Manila"
								value={formData?.city}
								onChange={handleChange}
								error={formErrors.city}
							/>
							<FormInput
								name="country"
								size="sm"
								title="Country/Region*"
								type="text"
								placeholder="Ex. Philippines"
								value={formData?.country}
								onChange={handleChange}
								error={formErrors.country}
							/>
						</div>
					</div>
					<div className="flex-none items-center px-5 py-3">
						{submitLoading ? (
							<button
								className="flex ml-auto px-6 py-1 rounded-full bg-blue-800 text-white font-bold"
								disabled
							>
								<FaSpinner className="w-6 h-6 animate-spin" />
							</button>
						) : (
							<button
								type="submit"
								className="flex ml-auto px-5 py-1 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-bold"
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

export default EditPageModal;
