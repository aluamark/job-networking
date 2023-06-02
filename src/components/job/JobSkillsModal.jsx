import React from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";

Modal.setAppElement("#root");

const SkillsModal = ({ isOpen, setIsOpen, skills, user }) => {
	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			overlayClassName="fixed inset-0 bg-black/75"
			className="min-h-screen h-screen flex justify-center items-center"
		>
			<div
				className={`bg-base-100 rounded-lg w-[550px] ${
					skills.length > 8 ? "h-[47.1%]" : null
				}`}
			>
				<div className="flex flex-col h-full">
					<div className="flex justify-between items-center py-3 pl-7 pr-3">
						<h3 className="text-lg font-semibold">Skill details</h3>
						<button
							onClick={closeModal}
							className="rounded-full hover:bg-base-300 cursor-pointer"
						>
							<MdClose className="w-7 h-7 m-1" />
						</button>
					</div>

					<div className="flex flex-col border-y border-base-300 px-7 py-5 h-[90%] overflow-y-auto">
						<div className="flex flex-col">
							<ul className="flex flex-col gap-3">
								{skills.map((skill, index) => (
									<li key={index} className="flex items-center gap-3">
										<BsCheckCircleFill
											className={`${
												user?.skills.includes(skill)
													? "fill-green-700"
													: "fill-zinc-500"
											} w-5 h-5`}
										/>
										{skill}
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="flex-none items-center px-5 py-3">
						<button
							onClick={closeModal}
							type="submit"
							className="flex ml-auto px-5 py-1 rounded-full bg-blue-700 hover:bg-blue-800 border text-white font-bold"
						>
							Done
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default SkillsModal;
