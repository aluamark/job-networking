import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setOpenModal } from "@/redux/reducer";
import Modal from "react-modal";
import { FaSpinner } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import FormInput from "@/components/form/FormInput";
import { addUserSkill } from "@/lib/helper";
import { ToastContainer, toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

Modal.setAppElement("#root");

const AddSkillModal = ({ user, isOpen, setIsOpen }) => {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	const [submitLoading, setSubmitLoading] = useState(false);
	const [skill, setSkill] = useState("");
	const [inputError, setInputError] = useState(null);

	const createUpdateMutation = useMutation({
		mutationFn: addUserSkill,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["loggedUser"],
			});
		},
	});

	const handleChange = (event) => {
		setSkill(event.target.value);
		setInputError("");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitLoading(true);

		if (!skill) {
			setInputError("Skill is a required field");
		} else {
			dispatch(setOpenModal(false));

			try {
				createUpdateMutation.mutate(
					{
						userId: user._id,
						userSkill: skill,
					},
					{
						onSuccess: (response) => {
							const { message } = response.data;
							toast.success(message);
							setSkill("");
							setIsOpen(false);
							setSubmitLoading(false);
						},
					}
				);
			} catch (error) {
				toast.error(error?.response?.data?.error);
				setSubmitLoading(false);
			}
		}
	};

	const closeModal = () => {
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
			<div className="bg-base-100 rounded-lg w-[550px]">
				<form onSubmit={handleSubmit} className="flex flex-col h-full">
					<div className="flex justify-between items-center py-3 pl-7 pr-3">
						<h3 className="text-lg font-semibold">Add skill</h3>
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
							</div>
							<FormInput
								name="skill"
								size="sm"
								title="Skill*"
								type="text"
								placeholder="Ex. Web development"
								value={skill}
								onChange={handleChange}
								error={inputError}
							/>
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

export default AddSkillModal;
