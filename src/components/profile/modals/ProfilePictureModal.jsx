import React, { useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setOpenModal } from "@/redux/reducer";
import { updateUserPicture } from "@/lib/helper";
import Modal from "react-modal";
import { FaSpinner } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

Modal.setAppElement("#root");

const ProfilePictureModal = ({ userId, picturePath, isOpen, setIsOpen }) => {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [uploadLoading, setUploadLoading] = useState(false);

	const createUpdateMutation = useMutation({
		mutationFn: updateUserPicture,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["loggedUser"],
			});
		},
	});

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);

		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setPreviewUrl(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageUpload = async () => {
		setUploadLoading(true);

		if (selectedFile) {
			dispatch(setOpenModal(false));

			const reader = new FileReader();
			reader.readAsDataURL(selectedFile);
			reader.onloadend = async () => {
				createUpdateMutation.mutate({
					data: reader.result,
					userId,
				});

				setSelectedFile(null);
				setUploadLoading(false);
				setIsOpen(false);
				toast.success("Upload was successful.");
			};
		} else {
			setUploadLoading(false);
			toast.error("No image selected.");
		}
	};

	const closeModal = () => {
		setPreviewUrl(null);
		setIsOpen(false);
		dispatch(setOpenModal(false));
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			overlayClassName="fixed inset-0 bg-black/75"
			className="min-h-screen h-screen flex justify-center items-center"
		>
			<div className="flex flex-col bg-base-100 rounded-lg w-[550px]">
				<div className="flex justify-between items-center py-3 pl-7 pr-3">
					<h3 className="text-lg font-semibold">Profile photo</h3>
					<button
						onClick={closeModal}
						className="rounded-full hover:bg-base-300 cursor-pointer"
					>
						<MdClose className="w-7 h-7 m-1" />
					</button>
				</div>

				<div className="flex p-7">
					<Image
						src={previewUrl ? previewUrl : picturePath}
						alt="profile-photo"
						className="w-64 h-64 object-cover rounded-full mx-auto overflow-y-auto"
						width={256}
						height={256}
					/>
				</div>

				<div className="flex items-center px-7 py-3 border-t border-base-300">
					<input
						type="file"
						onChange={handleFileChange}
						className="text-sm cursor-pointer file:cursor-pointer
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border
                            file:text-sm file:font-semibold
                            file:bg-base-100
                            hover:file:bg-base-200"
					/>

					{uploadLoading ? (
						<button
							disabled
							className="flex ml-auto px-6 py-1 rounded-full bg-blue-700 text-white font-bold"
						>
							<FaSpinner className="w-6 h-6 animate-spin" />
						</button>
					) : (
						<button
							onClick={() => {
								setUploadLoading(true);
								handleImageUpload();
							}}
							className="flex ml-auto px-5 py-1 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-bold"
						>
							Save
						</button>
					)}
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

export default ProfilePictureModal;
