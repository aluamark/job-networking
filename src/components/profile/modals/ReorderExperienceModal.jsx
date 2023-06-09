import React, { use, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { setOpenModal } from "@/redux/reducer";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "@/lib/StrictModeDroppable";
import { reorderUserExperiences } from "@/lib/helper";
import { MdDragIndicator, MdClose } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

Modal.setAppElement("#root");

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const ReorderExperienceModal = ({
	userId,
	userExperiences,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useDispatch();
	const [submitLoading, setSubmitLoading] = useState(false);

	const [experiences, setExperiences] = useState(userExperiences);
	useEffect(() => {
		setExperiences(userExperiences);
	}, [userExperiences]);

	const queryClient = useQueryClient();
	const createUpdateMutation = useMutation({
		mutationFn: reorderUserExperiences,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["loggedUser"],
			});
		},
	});

	const handleOnDragEnd = (result) => {
		const { source, destination } = result;
		if (!destination) {
			return;
		}
		const items = reorder(experiences, source.index, destination.index);

		setExperiences(items);
	};

	const handleSubmit = async () => {
		setSubmitLoading(true);
		dispatch(setOpenModal(false));

		try {
			createUpdateMutation.mutate(
				{
					userId,
					reorderedExperiences: experiences,
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
	};

	const closeModal = () => {
		dispatch(setOpenModal(false));
		setIsOpen(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			overlayClassName="fixed inset-0 bg-black/75"
			className="min-h-screen h-screen flex justify-center items-center"
		>
			<div className="bg-base-100 rounded-lg w-[550px]">
				<div className="flex justify-between items-center py-3 pl-7 pr-3">
					<h3 className="text-lg font-semibold">Reorder experiences</h3>
					<button
						onClick={closeModal}
						className="rounded-full hover:bg-base-300 cursor-pointer"
					>
						<MdClose className="w-7 h-7 m-1" />
					</button>
				</div>

				<div className="flex flex-col gap-5 border-y border-base-300 px-7 overflow-y-auto">
					{experiences ? (
						<DragDropContext onDragEnd={handleOnDragEnd}>
							<Droppable droppableId="experiences">
								{(provided) => (
									<section
										{...provided.droppableProps}
										ref={provided.innerRef}
										className="flex flex-col divide-y divide-base-300"
									>
										{experiences.map((experience, index) => {
											return (
												<Draggable
													key={experience._id}
													draggableId={experience._id.toString()}
													index={index}
												>
													{(provided) => (
														<div
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															ref={provided.innerRef}
															className="flex items-center text-sm py-3"
														>
															<div className="flex flex-col">
																<span className="font-semibold">
																	{experience.title}
																</span>
																<span className="text-xs">
																	{experience.company} · {experience.location} ·{" "}
																	{experience.employmentType}
																</span>
																<span className="text-zinc-500 text-xs">
																	{experience.startDateMonth}{" "}
																	{experience.startDateYear}{" "}
																	{experience.endDateMonth
																		? `- ${experience.endDateMonth} ${experience.endDateYear}`
																		: null}
																</span>
															</div>

															<div className="flex ml-auto">
																<MdDragIndicator className="w-6 h-6" />
															</div>
														</div>
													)}
												</Draggable>
											);
										})}
										{provided.placeholder}
									</section>
								)}
							</Droppable>
						</DragDropContext>
					) : null}
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
							onClick={handleSubmit}
							className="flex ml-auto px-5 py-1 rounded-full bg-blue-700 hover:bg-blue-800 border text-white font-bold"
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

export default ReorderExperienceModal;
