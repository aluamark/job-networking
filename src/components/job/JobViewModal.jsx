import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Modal from "react-modal";
import { signIn } from "next-auth/react";
import { getTimeDifference, renderDescription } from "@/lib/helper";
import { BsBriefcaseFill, BsListCheck, BsArrowLeftShort } from "react-icons/bs";
import SkillsModal from "./JobSkillsModal";

Modal.setAppElement("#root");

const JobViewModal = ({ isOpen, setIsOpen, selectedJob, user }) => {
	const [skillsModal, setSkillsModal] = useState(false);

	const [isExpanded, setIsExpanded] = useState(false);
	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};
	const truncatedText = isExpanded
		? selectedJob?.company.about
		: selectedJob?.company.about.slice(0, 300) + "...";
	const showButton = selectedJob?.company.about.length > 100;

	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			overlayClassName="md:hidden fixed inset-0 bg-black/75"
			className="md:hidden min-h-screen h-screen flex justify-center items-center"
		>
			<div className="fixed top-0 left-0 flex w-full p-3 bg-base-100">
				<button onClick={closeModal} className="">
					<BsArrowLeftShort className="w-7 h-7" />
				</button>
			</div>
			<div className="flex flex-col gap-5 w-full h-full px-7 pb-5 pt-14 bg-base-100 overflow-y-scroll">
				<div className="flex flex-col gap-1.5">
					<span className="text-2xl font-semibold">{selectedJob?.title}</span>

					<div className="text-sm">
						<span>
							<Link
								href={`/company/${selectedJob.company.uniqueAddress}`}
								className="link link-hover hover:text-blue-600"
							>
								{selectedJob.company.name}
							</Link>{" "}
							· {selectedJob.city}, {selectedJob.country} (
							{selectedJob.locationType}){" "}
						</span>
						<span className="text-zinc-500">
							{getTimeDifference(selectedJob.createdAt)}
						</span>
					</div>
				</div>

				<div className="flex flex-col gap-2.5 text-sm">
					{selectedJob.employmentType && (
						<div className="flex items-center gap-3">
							<BsBriefcaseFill className="h-5 w-5" />
							{selectedJob.employmentType}
						</div>
					)}

					{selectedJob.skills.length !== 0 && (
						<button
							onClick={() => setSkillsModal(true)}
							className="flex items-center gap-3"
						>
							<BsListCheck className="h-5 w-5" />
							Skills:{" "}
							{selectedJob.skills.length > 2
								? `${selectedJob.skills[0]}, ${selectedJob.skills[1]}, +${
										selectedJob.skills.length - 2
								  } more`
								: selectedJob.skills === 1
								? `${selectedJob.skills[0]}`
								: `${selectedJob.skills[0]}, ${selectedJob.skills[1]}`}
						</button>
					)}
				</div>
				<div className="flex gap-1.5">
					<button className="bg-blue-700 hover:bg-blue-800 duration-300 text-white px-5 rounded-full font-semibold">
						Apply
					</button>
					<button
						onClick={() => signIn()}
						className="h-10 w-20 box-border hover:box-border border border-blue-600 hover:bg-blue-50 duration-300 hover:border-2 text-blue-600 px-5 rounded-full font-semibold"
					>
						Save
					</button>
				</div>
				{selectedJob.postedBy && (
					<div className="flex flex-col gap-2.5 border border-base-300 rounded-lg px-5 pt-3 pb-5">
						<span className="text-lg font-semibold">Meet the hiring team</span>
						<div className="flex gap-1.5">
							<Link
								href={`/gh/${selectedJob.postedBy.email}`}
								className="flex-none"
							>
								<Image
									src={
										selectedJob.postedBy.picturePath
											? selectedJob.postedBy.picturePath
											: "/default.png"
									}
									alt="hiring-member-photo"
									className="w-[56px] h-[56px] rounded-full object-cover"
									width={56}
									height={56}
								/>
							</Link>
							<div className="flex flex-col text-sm">
								<span className="font-semibold">
									<Link
										href={`/gh/${selectedJob.postedBy.email}`}
										className="link link-hover"
									>
										{selectedJob.postedBy.firstName}{" "}
										{selectedJob.postedBy.lastName}
									</Link>
								</span>
								<span>{selectedJob.postedBy.headline}Senior HR Executive</span>
								<span className="text-xs text-zinc-500">Job poster</span>
							</div>
						</div>
					</div>
				)}
				<div className="flex flex-col gap-3">
					<span className="text-lg font-semibold">About the job</span>
					<div className="text-sm">
						{renderDescription(selectedJob.description)}
					</div>
				</div>

				<div className="border border-base-300 rounded-lg">
					<div className="p-5">
						<span className="text-xl font-semibold">About the company</span>
						<div className="flex py-5">
							<Link
								href={`/company/${selectedJob.company.uniqueAddress}`}
								className="flex items-center gap-3"
							>
								<Image
									src={selectedJob.company.picturePath}
									alt="about-the-company-logo"
									width={56}
									height={56}
								/>
								<div>
									<span className="link link-hover hover:text-blue-600 font-semibold">
										{selectedJob.company.name}
									</span>
								</div>
							</Link>
						</div>
						<span>{selectedJob.company.industry}</span>
						<p className="text-zinc-500 pt-5">
							{truncatedText}
							{showButton && (
								<button
									className="ml-2 focus:outline-none"
									onClick={toggleExpand}
								>
									{isExpanded ? "See Less" : "See More"}
								</button>
							)}
						</p>
					</div>
					<Link
						href={`/company/${selectedJob.company.uniqueAddress}`}
						className="flex justify-center py-2.5 border-t border-base-300 text-blue-600 font-semibold cursor-pointer"
					>
						Show more
					</Link>
				</div>
				<SkillsModal
					isOpen={skillsModal}
					setIsOpen={setSkillsModal}
					skills={selectedJob.skills}
					user={user}
				/>
			</div>
		</Modal>
	);
};

export default JobViewModal;
