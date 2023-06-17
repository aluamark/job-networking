import React, { useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getUser, getRandomUsers } from "@/lib/helper";
import { useDispatch } from "react-redux";
import { setOpenModal } from "@/redux/reducer";
import { BsArrowRightShort, BsArrowUpShort } from "react-icons/bs";
import { useSession } from "next-auth/react";
import ProfilePictureModal from "./modals/ProfilePictureModal";
import ContactInfoModal from "./modals/ContactInfoModal";
import People from "../widgets/People";
import Loading from "../widgets/Loading";

const ViewProfile = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { email } = router.query;
	const { data } = useSession();

	const user = useQuery({
		queryKey: ["userProfile", email],
		queryFn: () => getUser(email),
		enabled: !!email,
		retry: false,
	});

	const randomUsers = useQuery({
		queryKey: ["people", email],
		queryFn: getRandomUsers,
		refetchOnWindowFocus: false,
	});

	const experienceRef = useRef(null);
	const handleScrollToExperience = () => {
		if (experienceRef.current) {
			experienceRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const [contactInfoModal, setContactInfoModal] = useState(false);
	const [profilePictureModal, setProfilePictureModal] = useState(false);
	const [showAllSkills, setShowAllSkills] = useState(false);

	if (user.isLoading || randomUsers.isLoading) {
		return <Loading />;
	}

	if (user.isError || randomUsers.isError) {
		return (
			<div className="min-h-screen bg-base-100">
				<div className="max-w-screen-sm mx-auto flex flex-col gap-3 items-center py-[4rem]">
					<Image src="/404.gif" alt="404" width={500} height={500} />
					<h2 className="text-3xl font-bold flex gap-1.5">
						<span className="text-error">404:</span>
						{user.error.response.data.error}
					</h2>
					<p className="text-center">
						Please check your URL or return to EmployX home.
					</p>
					<Link
						href="/"
						className="flex items-center box-border border border-blue-500 text-blue-500 px-4 py-1 transition duration-150 hover:bg-blue-100 hover:border-2 rounded-full h-10 mt-2 font-semibold"
					>
						Go to EmployX home
					</Link>
				</div>
			</div>
		);
	}

	if (user.data)
		return (
			<div className="max-w-screen-xl mx-auto py-20 md:px-5">
				<Head>
					<title>
						{user
							? `${user.data.firstName} ${user.data.lastName} | EmployX`
							: "EmployX"}
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
								<div className="flex flex-col md:flex-row justify-between pt-[72px]">
									<div className="flex flex-col px-5">
										<h1 className="text-xl font-semibold">
											{user.data.firstName} {user.data.lastName}
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
												className="link link-hover text-blue-600 font-semibold"
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
						</div>

						{user.data.experiences.length !== 0 && (
							<div
								ref={experienceRef}
								className="bg-base-100 border border-base-300 rounded-lg p-5"
							>
								<span className="text-lg font-semibold">Experience</span>
								<div className="flex flex-col divide-y divide-base-300">
									{user.data?.experiences?.map((experience) => (
										<div
											key={experience}
											className="flex flex-col text-sm py-3"
										>
											<span className="font-semibold">{experience.title}</span>
											<span className="text-xs">
												{experience.company} · {experience.location} ·{" "}
												{experience.employmentType}
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

						{user.data.skills.length !== 0 && (
							<div className="bg-base-100 border border-base-300 rounded-lg">
								<div
									className={`flex items-center px-5 pt-5 ${
										user.data.skills.length === 0 ? "pb-5" : "pb-0"
									}`}
								>
									<span className="text-lg font-semibold">Skills</span>
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
												<div
													key={index}
													className="flex flex-col text-sm py-2.5"
												>
													<span className="font-semibold">{skill}</span>
												</div>
										  ))
										: user.data.skills?.map((skill, index) => (
												<div
													key={index}
													className="flex flex-col text-sm py-2.5"
												>
													<span className="font-semibold">{skill}</span>
												</div>
										  ))}
								</div>

								{user.data.skills.length > 3 ? (
									<>
										{!showAllSkills ? (
											<div
												onClick={() => setShowAllSkills(true)}
												className="flex justify-center items-center py-1.5 hover:bg-base-300 rounded-b border-t border-base-300 cursor-pointer text-sm"
											>
												Show all {user.data.skills.length} skills
												<BsArrowRightShort className="w-6 h-6" />
											</div>
										) : (
											<div
												onClick={() => setShowAllSkills(false)}
												className="flex justify-center items-center py-1.5 hover:bg-base-300 rounded-b border-t border-base-300 cursor-pointer text-sm"
											>
												Collapse
												<BsArrowUpShort className="w-6 h-6" />
											</div>
										)}
									</>
								) : null}
							</div>
						)}
					</div>

					<div className="flex flex-col gap-3 w-full md:flex-none md:w-1/3 lg:w-1/4">
						<People
							randomUsers={randomUsers.data}
							userEmail={data?.user?.email}
						/>
					</div>
				</div>

				<ProfilePictureModal
					userId={user.data._id}
					userEmail={user.data.email}
					picturePath={
						user.data.picturePath ? user.data.picturePath : "/default.png"
					}
					isOpen={profilePictureModal}
					setIsOpen={setProfilePictureModal}
				/>

				<ContactInfoModal
					user={user.data}
					ownProfile={false}
					isOpen={contactInfoModal}
					setIsOpen={setContactInfoModal}
				/>
			</div>
		);
};

export default ViewProfile;
