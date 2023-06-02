import React, { useState, useRef } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setOpenModal } from "@/redux/reducer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "react-modal";
import { FaSpinner } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import FormInput from "@/components/form/FormInput";
import { submitApplication } from "@/lib/helper";
import { ToastContainer, toast } from "react-toastify";

Modal.setAppElement("#root");

const JobApplicationModal = ({ user, selectedJob, isOpen, setIsOpen }) => {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	const [submitLoading, setSubmitLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [formData, setFormData] = useState({
		userId: user?._id,
		jobId: selectedJob?._id,
		email: user?.email,
		phone: "",
	});
	const [formErrors, setFormErrors] = useState({
		email: "",
		phone: "",
	});

	const createUpdateMutation = useMutation({
		mutationFn: submitApplication,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["loggedUser"],
			});
			queryClient.invalidateQueries({
				queryKey: ["jobs"],
			});
		},
	});

	const fileInputRef = useRef(null);
	const handleClick = () => {
		fileInputRef.current.click();
	};

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
		setFormErrors({ ...formErrors, [name]: "" });
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const fileType = file.type;
			const validFileType = "application/pdf";
			if (fileType !== validFileType) {
				toast.error("Invalid file type");
				return;
			} else {
				setFormErrors({ ...formErrors, selectedFile: "" });
			}
			setSelectedFile(file);
		} else {
			setFormErrors({ ...formErrors, selectedFile: "" });
			setSelectedFile(null);
		}
	};

	const handleSubmit = async () => {
		setSubmitLoading(true);

		const errors = {};

		if (!formData.email) {
			errors.email = "Please enter a valid email";
		}

		if (!formData.phone) {
			errors.phone = "Enter a valid phone number";
		}

		if (!selectedFile) {
			toast.error("Don't forget to include your updated resume.");
		}

		if (Object.keys(errors).length === 0 && selectedFile) {
			dispatch(setOpenModal(false));

			try {
				const reader = new FileReader();
				reader.readAsDataURL(selectedFile);
				reader.onloadend = async () => {
					createUpdateMutation.mutate(
						{
							userId: user._id,
							jobId: selectedJob._id,
							email: formData.email,
							phone: formData.phone,
							data: reader.result,
						},
						{
							onSuccess: (response) => {
								console.log(response);
								const { message } = response.data;
								toast.success(message);
							},
						}
					);

					setIsOpen(false);
				};
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

	if (user)
		return (
			<Modal
				isOpen={isOpen}
				onRequestClose={closeModal}
				overlayClassName="fixed inset-0 bg-black/75"
				className="min-h-screen h-screen flex justify-center items-center"
			>
				<div className="bg-base-100 rounded-lg w-[774px] h-[49.4%]">
					<div className="flex flex-col h-full">
						<div className="flex justify-between items-center py-3 pl-7 pr-3">
							<h3 className="text-lg font-semibold">
								Apply to {selectedJob.company.name}
							</h3>
							<button
								onClick={closeModal}
								className="rounded-full hover:bg-base-300 cursor-pointer"
							>
								<MdClose className="w-7 h-7 m-1" />
							</button>
						</div>

						<div className="flex flex-col gap-5 border-y border-base-300 px-7 py-5 overflow-y-auto">
							<div className="flex flex-col">
								<h3 className="text-lg font-semibold">Contact Info</h3>
								<div className="flex gap-3 pt-3">
									<Image
										src={user.picturePath ? user.picturePath : "/default.png"}
										width={56}
										height={56}
										alt="user-picture"
										className="w-[56px] h-[56px] rounded-full border border-base-300"
									/>
									<div className="flex flex-col">
										<span className="font-semibold">
											{user.firstName} {user.lastName}
										</span>
										<span className="text-sm">{user.headline}</span>
										<span className="text-xs text-zinc-500">
											{user.city && user.country
												? `${user.city}, ${user.country}`
												: user.city || user.country}
										</span>
									</div>
								</div>
								<div className="pb-3">
									<FormInput
										name="email"
										size="sm"
										title="Email*"
										type="text"
										value={formData.email}
										onChange={handleChange}
										error={formErrors.firstName}
									/>
									<FormInput
										name="phone"
										size="sm"
										title="Phone*"
										type="text"
										value={formData.phone}
										onChange={handleChange}
										error={formErrors.phone}
									/>
								</div>
								<div className="flex flex-col gap-3">
									<span className="text-sm">
										Be sure to include an updated resume
									</span>
									{selectedFile && (
										<div className="flex border border-base-300 rounded-lg">
											<div className="font-semibold p-5 rounded-l-lg bg-red-500 text-white">
												PDF
											</div>
											<div className="flex justify-between items-center w-full p-5 text-sm">
												<span>{selectedFile.name}</span>

												<MdClose
													onClick={() => setSelectedFile(null)}
													className="w-6 h-6 cursor-pointer"
												/>
											</div>
										</div>
									)}
									<input
										name="selectedFile"
										type="file"
										onChange={handleFileChange}
										className="hidden"
										ref={fileInputRef}
									/>
									<div>
										<button
											onClick={handleClick}
											className="rounded-full border border-blue-500 px-3 py-1 text-blue-500  font-semibold"
										>
											Select resume
										</button>
										<label className="label px-0 pb-0">
											<span className="label-text">DOC, DOCX, PDF (5 MB)</span>
										</label>
									</div>
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
									onClick={handleSubmit}
									className="flex ml-auto px-5 py-1 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-bold"
								>
									Submit application
								</button>
							)}
						</div>
					</div>
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

export default JobApplicationModal;
