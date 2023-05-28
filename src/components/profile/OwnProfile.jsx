import React, { useRef, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModal } from "@/redux/reducer";
import { getRandomUsers } from "@/lib/helper";
import { MdAdd } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { HiChevronUpDown } from "react-icons/hi2";
import { BsArrowRightShort, BsArrowUpShort } from "react-icons/bs";
import EditProfileModal from "@/components/profile/modals/EditProfileModal";
import AddExperienceModal from "./modals/AddExperienceModal";
import ReorderExperienceModal from "./modals/ReorderExperienceModal";
import ReorderSkillModal from "./modals/ReorderSkillModal";
import ContactInfoModal from "@/components/profile/modals/ContactInfoModal";
import ProfilePictureModal from "./modals/ProfilePictureModal";
import { PuffLoader } from "react-spinners";
import People from "../widgets/People";
import AddSkillModal from "./modals/AddSkillModal";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";

const OwnProfile = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { email } = router.query;
	const user = useLoggedUserQuery();

	const randomUsers = useQuery({
		queryKey: ["people", email],
		queryFn: getRandomUsers,
		refetchOnWindowFocus: false,
	});

	const [editProfileModal, setEditProfileModal] = useState(false);
	const [addExperienceModal, setAddExperienceModal] = useState(false);
	const [reorderExperienceModal, setReorderExperienceModal] = useState(false);
	const [addSkillModal, setAddSkillModal] = useState(false);
	const [reorderSkillModal, setReorderSkillModal] = useState(false);
	const [contactInfoModal, setContactInfoModal] = useState(false);
	const [profilePictureModal, setProfilePictureModal] = useState(false);
	const [showAllSkills, setShowAllSkills] = useState(false);

	const experienceRef = useRef(null);
	const handleScrollToExperience = () => {
		if (experienceRef.current) {
			experienceRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	if (user.isLoading || randomUsers.isLoading)
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-10">
				<span className="text-5xl font-extrabold text-blue-600">GetHired</span>
				<PuffLoader />
			</div>
		);

	if (user.data)
		return (
			<div className="max-w-screen-xl mx-auto py-20 md:px-5">
				<Head>
					<title>
						{user
							? `${user.data.firstName} ${user.data.lastName} | GetHired`
							: "GetHired"}
					</title>
				</Head>
				<div className="flex flex-col md:flex-row gap-1.5 md:gap-5">
					<div className="w-full flex flex-col gap-1.5">
						<div className="relative">
							<div className="absolute left-5 top-5 md:top-24 rounded-full p-1 bg-base-100">
								<button
									className="rounded-full"
									onClick={() => {
										dispatch(setOpenModal(true));
										setProfilePictureModal(true);
									}}
								>
									<Image
										src={
											user.data.picturePath
												? user.data.picturePath
												: "/default.png"
										}
										alt="profile-picture"
										className="rounded-full w-40 h-40 object-cover"
										width={160}
										height={160}
									/>
								</button>
							</div>

							<figure>
								<Image
									src="/banner.jpg"
									alt="banner"
									className="rounded-t-lg h-32 md:h-52 w-full object-cover border-t border-base-300"
									width={910}
									height={208}
									priority
								/>
							</figure>

							<div className="bg-base-100 rounded-b-lg border border-base-300 pb-5">
								<div className="p-3">
									<button
										onClick={() => {
											dispatch(setOpenModal(true));
											setEditProfileModal(true);
										}}
										className="flex ml-auto btn btn-ghost btn-circle"
									>
										<FiEdit2 className="w-6 h-6" />
									</button>
								</div>
								<div className="flex flex-col md:flex-row justify-between">
									<div className="flex flex-col px-5">
										<h1 className="text-xl font-semibold">
											{`${user.data.firstName} ${user.data.lastName}`}
											{user.data.pronoun && (
												<span className="text-zinc-500 text-sm pl-1">
													({user.data.pronoun})
												</span>
											)}
										</h1>
										<span>{user.data.headline}</span>
										<div className="pt-1 text-sm hidden md:block">
											<span className="text-zinc-500">
												{user.data.city && user.data.country
													? `${user.data.city}, ${user.data.country} · `
													: user.data.country
													? `${user.data.country} · `
													: null}
											</span>
											<span
												onClick={() => setContactInfoModal(true)}
												className="link link-hover text-blue-500 font-semibold"
											>
												Contact info
											</span>
										</div>
									</div>

									<div className="flex pt-1 flex-col px-5 text-zinc-500 md:text-current">
										{user.data.experiences.length !== 0 && (
											<span
												onClick={handleScrollToExperience}
												className="link link-hover text-sm hover:text-blue-500 md:font-semibold"
											>
												{user.data.experiences[0]?.title}
											</span>
										)}
									</div>
								</div>

								<div className="pt-1 text-sm px-5 md:hidden">
									<span className="text-zinc-500">
										{user.data.city && user.data.country
											? `${user.data.city}, ${user.data.country} · `
											: user.data.country
											? `${user.data.country} · `
											: null}
									</span>
									<span
										onClick={() => setContactInfoModal(true)}
										className="link link-hover text-blue-500 font-semibold"
									>
										Contact info
									</span>
								</div>
							</div>
						</div>

						{user.data.experiences.length !== 0 && (
							<div
								ref={experienceRef}
								className="bg-base-100 border border-base-300 rounded-lg p-5"
							>
								<div className="flex items-center">
									<span className="text-lg font-semibold">Experience</span>
									<div className="flex ml-auto">
										{user.data.experiences.length > 1 ? (
											<button
												onClick={() => {
													dispatch(setOpenModal(true));
													setReorderExperienceModal(true);
												}}
												className="btn btn-ghost btn-sm btn-circle"
											>
												<HiChevronUpDown className="w-6 h-6" />
											</button>
										) : null}
									</div>
								</div>

								<div className="flex flex-col divide-y divide-base-300">
									{user.data.experiences?.map((experience) => (
										<div
											key={experience}
											className="flex flex-col text-sm py-2.5"
										>
											<span className="font-semibold">{experience.title}</span>
											<span className="text-xs">
												{experience.employmentType
													? `${experience.company} · ${experience.location} · ${experience.employmentType}`
													: `${experience.company} · ${experience.location}`}
											</span>
											<span className="text-zinc-500 text-xs">
												{experience.startDateMonth} {experience.startDateYear}
												{experience.endDateMonth
													? ` - ${experience.endDateMonth} ${experience.endDateYear}`
													: " - Present"}
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						<div className="bg-base-100 border border-base-300 rounded-lg">
							<div
								className={`flex items-center px-5 pt-5 ${
									user.data.skills.length === 0 ? "pb-5" : "pb-0"
								}`}
							>
								<span className="text-lg font-semibold">Skills</span>
								<div className="flex ml-auto">
									{user.data.skills.length > 1 ? (
										<button
											onClick={() => {
												dispatch(setOpenModal(true));
												setReorderSkillModal(true);
											}}
											className="btn btn-ghost btn-sm btn-circle"
										>
											<HiChevronUpDown className="w-6 h-6" />
										</button>
									) : null}

									<button
										onClick={() => {
											dispatch(setOpenModal(true));
											setAddSkillModal(true);
										}}
										className="btn btn-ghost btn-sm btn-circle"
									>
										<MdAdd className="w-6 h-6" />
									</button>
								</div>
							</div>

							<div
								className={`flex flex-col divide-y divide-base-300 px-5 ${
									user.data.skills.length > 3 || user.data.skills.length === 0
										? "pb-0"
										: "pb-5"
								}`}
							>
								{!showAllSkills
									? user.data.skills?.slice(0, 3).map((skill, index) => (
											<div key={index} className="flex flex-col text-sm py-2.5">
												<span className="font-semibold">{skill}</span>
											</div>
									  ))
									: user.data.skills?.map((skill, index) => (
											<div key={index} className="flex flex-col text-sm py-2.5">
												<span className="font-semibold">{skill}</span>
											</div>
									  ))}
							</div>

							{user.data.skills.length > 3 && (
								<div
									onClick={() => setShowAllSkills(!showAllSkills)}
									className="flex justify-center items-center py-2.5 hover:bg-base-300 rounded-b border-t border-base-300 cursor-pointer text-sm font-semibold"
								>
									{!showAllSkills ? (
										<>
											Show all {user.data.skills.length} skills
											<BsArrowRightShort className="w-6 h-6" />
										</>
									) : (
										<>
											Collapse
											<BsArrowUpShort className="w-6 h-6" />
										</>
									)}
								</div>
							)}
						</div>
					</div>

					<div className="flex flex-col gap-1.5 w-full md:flex-none md:w-1/3 lg:w-1/4">
						<div className="bg-base-100 border border-base-300 rounded-lg p-5">
							<Link href="/job-posting">
								<span className="font-semibold link link-hover text-blue-600">
									Job Posting Account
								</span>
							</Link>
						</div>
						<People
							randomUsers={randomUsers.data}
							userEmail={user.data.email}
						/>
					</div>
				</div>
				<ProfilePictureModal
					userId={user.data._id}
					picturePath={
						user.data.picturePath ? user.data.picturePath : "/default.png"
					}
					isOpen={profilePictureModal}
					setIsOpen={setProfilePictureModal}
				/>
				<EditProfileModal
					user={user.data}
					isOpen={editProfileModal}
					setIsOpen={setEditProfileModal}
					setAddExperienceModal={setAddExperienceModal}
				/>
				<AddExperienceModal
					user={user.data}
					isOpen={addExperienceModal}
					setIsOpen={setAddExperienceModal}
					setEditProfileModal={setEditProfileModal}
				/>
				<ReorderExperienceModal
					userId={user.data._id}
					userExperiences={user.data.experiences}
					isOpen={reorderExperienceModal}
					setIsOpen={setReorderExperienceModal}
				/>
				<AddSkillModal
					user={user.data}
					isOpen={addSkillModal}
					setIsOpen={setAddSkillModal}
				/>
				<ReorderSkillModal
					userId={user.data._id}
					userSkills={user.data.skills}
					isOpen={reorderSkillModal}
					setIsOpen={setReorderSkillModal}
				/>
				<ContactInfoModal
					user={user.data}
					ownProfile={true}
					isOpen={contactInfoModal}
					setIsOpen={setContactInfoModal}
				/>
			</div>
		);
};

export default OwnProfile;
