import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModal } from "@/redux/reducer";
import { getRandomUsers } from "@/lib/helper";
import { FiEdit2 } from "react-icons/fi";
import EditProfileModal from "@/components/widgets/EditProfileModal";
import ContactInfoModal from "@/components/widgets/ContactInfoModal";
import ProfilePictureModal from "../widgets/ProfilePictureModal";
import { PuffLoader } from "react-spinners";

const OwnProfile = () => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const { data, status } = useSession();
	const fullName = user?.firstName + " " + user?.lastName;
	const [editProfileModal, setEditProfileModal] = useState(false);
	const [contactInfoModal, setContactInfoModal] = useState(false);
	const [profilePictureModal, setProfilePictureModal] = useState(false);
	const [randomUsers, setRandomUsers] = useState([]);

	const fetchRandomUsers = async (email) => {
		const users = await getRandomUsers();
		const filteredUsers = users.filter((user) => user.email !== email);

		setRandomUsers(filteredUsers);
	};

	useEffect(() => {
		if (status === "authenticated" && data.user.email) {
			fetchRandomUsers(data.user.email);
		}
	}, [status]);

	if (!user)
		return (
			<div className="min-h-screen flex justify-center items-center">
				<PuffLoader />
			</div>
		);

	if (user)
		return (
			<div className="max-w-screen-xl mx-auto pt-20 md:pt-24 md:px-5 pb-5">
				<Head>
					<title>{user ? `${fullName} | GetHired` : "GetHired"}</title>
				</Head>
				<div className="flex flex-col md:flex-row gap-5">
					<div className="w-full flex flex-col gap-5">
						<div className="relative">
							<div className="absolute left-7 top-5 md:top-24 rounded-full p-1 bg-base-100">
								<button
									className="rounded-full"
									onClick={() => {
										dispatch(setOpenModal(true));
										setProfilePictureModal(true);
									}}
								>
									<img
										src={user.picturePath ? user.picturePath : "/default.png"}
										alt="profile-picture"
										className="rounded-full w-40 h-40 object-cover"
									/>
								</button>
							</div>

							<figure>
								<img
									src="/banner.jpg"
									alt="banner"
									className="rounded-t-lg h-32 md:h-52 w-full object-cover border-t border-base-300"
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
								<div className="flex flex-col lg:flex-row justify-between lg:gap-5 px-7">
									<div className="flex flex-col">
										<h1 className="text-xl font-semibold">
											{fullName}
											{user.pronoun && (
												<span className="text-zinc-500 text-sm pl-1">
													({user.pronoun})
												</span>
											)}
										</h1>
										<span>{user?.headline}</span>
										<div className="pt-1 text-sm lg:text-base">
											<span className="text-zinc-500">
												{user.city && user.country
													? `${user.city}, ${user.country} · `
													: user.country
													? `${user.country} · `
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
									<div>
										<span className="link link-hover text-sm lg:text-base text-zinc-500 hover:text-blue-600 lg:font-semibold">
											College of San Benildo - Rizal
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-base-100 border border-base-300 rounded-lg p-5">
							<span className="text-lg font-semibold">Add Skills</span>
							<ul className="flex flex-col divide-y divide-base-300 gap-y-3 font-semibold">
								<li className="pt-3">NextJS</li>
								<li className="pt-3">JavaScript</li>
								<li className="pt-3">React</li>
							</ul>
						</div>
					</div>

					<div className="flex flex-col gap-3 w-full md:flex-none md:w-1/3 lg:w-1/4">
						<div className="bg-base-100 border border-base-300 rounded-lg p-5">
							<span className="font-semibold">Edit public profile</span>
						</div>
						<div className="bg-base-100 border border-base-300 rounded-lg py-3 px-5">
							<h3 className="font-semibold">People you may know</h3>
							{/* <p className="text-zinc-500 text-sm">From your school</p> */}
							<div className="flex flex-col divide-y divide-base-300 text-sm">
								{randomUsers?.map((user) => {
									return (
										<Link href={`/gh/${user.email}`} key={user._id}>
											<div className="flex gap-3 w-full py-3">
												<img
													src={
														user.picturePath ? user.picturePath : "/default.png"
													}
													alt="picture"
													className="w-14 h-14 rounded-full object-cover"
												/>
												<div>
													<div>
														<span className="font-semibold">
															{user.firstName} {user.lastName}
														</span>
													</div>
													<div>
														<span className="text-zinc-500 text-xs">
															{user.headline}
														</span>
													</div>

													<div className="pt-2">
														<button className="btn btn-outline btn-sm rounded-full">
															Connect
														</button>
													</div>
												</div>
											</div>
										</Link>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				<ProfilePictureModal
					userId={user._id}
					picturePath={user.picturePath ? user.picturePath : "/default.png"}
					isOpen={profilePictureModal}
					setIsOpen={setProfilePictureModal}
				/>

				<EditProfileModal
					user={user}
					isOpen={editProfileModal}
					setIsOpen={setEditProfileModal}
				/>

				<ContactInfoModal
					user={user}
					ownProfile={true}
					isOpen={contactInfoModal}
					setIsOpen={setContactInfoModal}
				/>
			</div>
		);
};

export default OwnProfile;
