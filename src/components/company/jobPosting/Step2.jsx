import React, { useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
import PreviewModal from "./PreviewModal";
import AddSkillModal from "./AddSkillModal";
import { MdClose } from "react-icons/md";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Step2 = ({
	company,
	formData,
	setFormData,
	handleDescriptionChange,
	previousStep,
	handleSubmit,
}) => {
	const [previewModal, setPreviewModal] = useState(false);
	const [addSkillModal, setAddSkillModal] = useState(false);

	const renderDescription = () => {
		const sanitizedDescription = DOMPurify.sanitize(formData.description);
		const descriptionWithBullets = sanitizedDescription.replace(
			/<li>/g,
			"<li class='pl-5'>&bull; "
		);

		return <div dangerouslySetInnerHTML={{ __html: descriptionWithBullets }} />;
	};

	const handleRemoveSkill = (skill) => {
		const skills = formData.skills.filter((s) => s !== skill);
		setFormData({ ...formData, skills });
	};

	return (
		<div className="max-w-screen-xl flex flex-col md:flex-row gap-5 mx-auto py-20 px-5">
			<div className="flex flex-col w-full">
				<div className="flex flex-col gap-3 bg-base-100 rounded-lg">
					<div className="flex items-center gap-3 border-b border-base-300 px-5 py-3">
						<button onClick={previousStep} className="">
							<BsArrowLeftShort className="w-6 h-6" />
						</button>
						<span className="text-xl font-semibold">Job Details</span>
					</div>
					<div className="flex flex-col gap-3 px-5">
						<span className="font-semibold">Add a job description</span>
						<div className="flex flex-col gap-2.5">
							<label className="text-sm">Description*</label>
							<ReactQuill
								theme="snow"
								name="description"
								value={formData.description}
								onChange={handleDescriptionChange}
								className="flex flex-col bg-base-100 border-y border-base-300 h-96 overflow-y-auto"
							/>
						</div>
						<div>
							<span className="font-semibold">Add skills</span>
							<p className="text-xs text-zinc-500">
								Add skill keywords to make your job more visible to the right
								candidates
							</p>
							<div className="flex flex-wrap gap-1 py-3">
								{formData.skills.map((skill) => (
									<button
										key={skill}
										onClick={() => handleRemoveSkill(skill)}
										className="flex items-center text-sm text-white bg-green-600 border border-green-600 rounded-full py-1 font-semibold"
									>
										<span className="pl-2">{skill}</span>{" "}
										<MdClose className="mx-1" />
									</button>
								))}

								<button
									onClick={() => setAddSkillModal(true)}
									className="text-sm text-green-600 border border-green-600 rounded-full px-3 py-1 font-semibold"
								>
									Add skill +
								</button>
							</div>
							<label className="label px-0 pt-0">
								<span className="label-text-alt">Add up to 10 skills</span>
								<span
									className={`label-text-alt ${
										formData?.skills.length === 10 ? "text-red-500" : null
									}`}
								>
									{formData?.skills.length}/10
								</span>
							</label>
						</div>
					</div>
					<div className="flex justify-between px-5 py-3 border-t border-base-300">
						<button
							onClick={() => setPreviewModal(true)}
							className="text-blue-600 font-semibold"
						>
							Preview
						</button>
						<button
							onClick={handleSubmit}
							className="bg-blue-600 rounded-full px-5 py-1 text-white font-semibold"
						>
							Post job
						</button>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-3 w-full">
				<div className="flex flex-col">
					<span className="text-xl font-bold">{formData.title}</span>

					<span className="text-sm">
						{company.name} · {formData.locationType} · {formData.city},{" "}
						{formData.country} · {formData.employmentType}
					</span>
				</div>
				<div className="flex flex-col gap-3">
					<span className="text-lg font-bold">About the job</span>
					<div className="text-sm">{renderDescription()}</div>
				</div>
			</div>
			<PreviewModal
				company={company}
				formData={formData}
				isOpen={previewModal}
				setIsOpen={setPreviewModal}
				renderDescription={renderDescription}
			/>
			<AddSkillModal
				skills={formData.skills}
				isOpen={addSkillModal}
				setIsOpen={setAddSkillModal}
				formData={formData}
				setFormData={setFormData}
			/>
		</div>
	);
};

export default Step2;
