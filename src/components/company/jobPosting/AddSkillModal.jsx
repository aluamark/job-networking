import React, { useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import FormInput from "@/components/form/FormInput";

Modal.setAppElement("#root");

const AddSkillModal = ({ isOpen, setIsOpen, formData, setFormData }) => {
	const [skill, setSkill] = useState("");
	const [inputError, setInputError] = useState("");

	const handleChange = (event) => {
		setSkill(event.target.value);
		setInputError("");
	};

	const handleAdd = () => {
		const updatedSkills = [...formData.skills];
		if (updatedSkills.length < 10) {
			updatedSkills.push(skill);
			setFormData({ ...formData, skills: updatedSkills });
			setSkill("");
			setIsOpen(false);
		} else {
			setInputError("You can only add up to 10 skills");
		}
	};

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
			<div className="bg-base-100 rounded-lg w-[550px]">
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
					<button
						onClick={handleAdd}
						type="submit"
						className="flex ml-auto px-5 py-1 rounded-full bg-blue-700 hover:bg-blue-800 border text-white font-bold"
					>
						Add
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default AddSkillModal;
