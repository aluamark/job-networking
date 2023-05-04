import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setOpenModal, setLoggedUser } from "@/redux/reducer";
import Modal from "react-modal";
import { FaSpinner } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import FormInput from "@/components/form/FormInput";
import { updateUser } from "@/lib/helper";
import { ToastContainer, toast } from "react-toastify";

Modal.setAppElement("#root");

const EditProfileModal = ({ user, isOpen, setIsOpen }) => {
	const dispatch = useDispatch();
	const [submitLoading, setSubmitLoading] = useState(false);
	const [formData, setFormData] = useState(null);
	const [formErrors, setFormErrors] = useState({
		firstName: "",
		lastName: "",
		headline: "",
		country: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
		setFormErrors({ ...formErrors, [name]: "" });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitLoading(true);

		const errors = {};

		if (!formData.firstName) {
			errors.firstName = "First name is a required field";
		}

		if (!formData.lastName) {
			errors.lastName = "Last name is a required field";
		}

		if (!formData.headline) {
			errors.headline = "Headline is a required field";
		}

		if (!formData.country) {
			errors.country = "Country/Region is a required field";
		}

		if (Object.keys(errors).length === 0) {
			dispatch(setOpenModal(false));

			const userData = new FormData();
			for (let data in formData) {
				userData.append(data, formData[data]);
			}

			try {
				const response = await updateUser(user._id, userData);
				const { message, updatedUser } = response;

				dispatch(setLoggedUser(updatedUser));
				setIsOpen(false);
				toast.success(message);
			} catch (error) {
				toast.error(error?.response?.data?.error);
			}
		} else {
			setFormErrors(errors);
		}
		setSubmitLoading(false);
	};

	const closeModal = () => {
		dispatch(setOpenModal(false));
		setIsOpen(false);
	};

	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName,
				lastName: user.lastName,
				additionalName: user.additionalName,
				headline: user.headline,
				pronoun: user.pronoun,
				city: user.city,
				country: user.country,
			});
		}
	}, [user]);

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			overlayClassName="fixed inset-0 bg-black/75"
			className="min-h-screen h-screen flex justify-center items-center"
		>
			<div className="bg-base-100 rounded-lg w-[550px] h-full md:h-[90%]">
				<form onSubmit={handleSubmit} className="flex flex-col h-full">
					<div className="flex justify-between items-center py-3 pl-7 pr-3">
						<h3 className="text-lg font-semibold">Edit intro</h3>
						<button
							onClick={closeModal}
							className="rounded-full hover:bg-base-300 cursor-pointer"
						>
							<MdClose className="w-7 h-7 m-1" />
						</button>
					</div>

					<div className="flex flex-col gap-5 border-y border-base-300 px-7 pb-7 overflow-y-auto">
						<div className="flex flex-col">
							<div className="pt-1">
								<span className="text-xs text-zinc-500">
									* Indicates required
								</span>
								<h3 className="text-lg font-semibold">Basic Info</h3>
							</div>
							<FormInput
								name="firstName"
								size="sm"
								title="First name*"
								type="text"
								placeholder="Enter your first name"
								value={formData?.firstName}
								onChange={handleChange}
								error={formErrors.firstName}
							/>
							<FormInput
								name="lastName"
								size="sm"
								title="Last name*"
								type="text"
								placeholder="Enter your last name"
								value={formData?.lastName}
								onChange={handleChange}
								error={formErrors.lastName}
							/>
							<FormInput
								name="additionalName"
								size="sm"
								title="Additional name"
								type="text"
								placeholder=""
								value={formData?.additionalName}
								onChange={handleChange}
								error={formErrors.additionalName}
							/>
							<FormInput
								name="headline"
								size="sm"
								title="Headline*"
								type="text"
								placeholder="Job title / Skill to promote"
								value={formData?.headline}
								onChange={handleChange}
								error={formErrors.headline}
							/>
							<div className="form-control w-full">
								<label className="label">
									<span className="label-text">Pronouns</span>
								</label>
								<select
									name="pronoun"
									onChange={handleChange}
									className="select select-bordered select-sm"
									defaultValue={formData?.pronoun}
								>
									<option value="">Please select</option>
									<option value="He/Him">He/Him</option>
									<option value="She/Her">She/Her</option>
									<option value="They/Them">They/Them</option>
									<option>Custom</option>
								</select>
								<label className="label">
									<span className="label-text-alt text-zinc-500">
										Let others know how to refer to you.
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

						<div className="flex flex-col">
							<h3 className="text-lg font-semibold">Current position</h3>
							<div className="pt-3">
								<button
									type="button"
									className="text-blue-600 hover:bg-blue-100 font-semibold px-2 py-1 rounded"
								>
									+ Add new position
								</button>
							</div>
						</div>

						<div className="flex flex-col">
							<h3 className="text-lg font-semibold">Education</h3>
							<div className="pt-3">
								<button
									type="button"
									className="text-blue-600 hover:bg-blue-100 font-semibold px-2 py-1 rounded"
								>
									+ Add new position
								</button>
							</div>
						</div>

						<div className="flex flex-col">
							<h3 className="text-lg font-semibold">Contact info</h3>
							<span>Add or edit your profile, email, phone, and more</span>
							<div className="pt-3">
								<button
									type="button"
									className="text-blue-600 hover:bg-blue-100 font-semibold px-2 py-1 rounded"
								>
									Edit contact info
								</button>
							</div>
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

export default EditProfileModal;
