import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { FiEdit2 } from "react-icons/fi";
import People from "../widgets/People";
import EditPageModal from "./modals/EditPageModal";
import PagePictureModal from "./modals/PagePictureModal";
import Overview from "./content/Overview";
import About from "./content/About";
import Jobs from "./content/Jobs";

const OwnPage = ({ company, randomUsers, createUpdateMutation }) => {
	const [editPageModal, setEditPageModal] = useState(false);
	const [pagePictureModal, setPagePictureModal] = useState(false);
	const [tab, setTab] = useState(0);

	const handleRenderTab = () => {
		switch (tab) {
			case 0:
				return (
					<Overview
						company={company.data}
						about={company.data.about}
						setTab={setTab}
					/>
				);
			case 1:
				return <About company={company.data} />;
			case 2:
				return (
					<Jobs
						companyId={company.data._id}
						companyName={company.data.name}
						companyPicture={company.data.picturePath}
						jobs={company.data.jobs}
					/>
				);
		}
	};

	if (company.data)
		return (
			<div className="max-w-screen-xl mx-auto py-20 md:px-5">
				<Head>
					<title>
						{company ? `${company.data.name} | EmployX` : "EmployX"}
					</title>
				</Head>
				<div className="flex flex-col lg:flex-row gap-3 lg:gap-5">
					<div className="w-full flex flex-col gap-3">
						<div className="relative">
							<div className="absolute left-5 top-16 flex p-1 bg-base-100">
								<button
									className="rounded-full"
									onClick={() => setPagePictureModal(true)}
								>
									<Image
										src={
											company.data.picturePath
												? company.data.picturePath
												: "/company.png"
										}
										alt="profile-picture"
										className="w-[112px] h-[112px] object-cover"
										width={112}
										height={112}
									/>
								</button>
							</div>

							<figure>
								<Image
									src="/banner.jpg"
									alt="banner"
									className="rounded-t-lg h-32 w-full object-cover border-t border-base-300"
									width={910}
									height={208}
									priority
								/>
							</figure>

							<div className="bg-base-100 rounded-b-lg border border-base-300">
								<div className="p-3">
									<button
										onClick={() => {
											setEditPageModal(true);
										}}
										className="flex ml-auto btn btn-ghost btn-circle"
									>
										<FiEdit2 className="w-6 h-6" />
									</button>
								</div>
								<div className="flex flex-col px-5 pb-5">
									<h1 className="text-3xl font-semibold">
										{company.data.name}
									</h1>
									<span>{company.data.tagline}</span>
									<div className="text-sm">
										<span className="text-zinc-500">
											{company.data.industry &&
											company.data.city &&
											company.data.country
												? `${company.data.industry} · ${company.data.city}, ${company.data.country}`
												: company.data.industry
												? company.data.industry
												: null}
										</span>
									</div>
								</div>

								<div className="tabs px-5 border-t border-base-300 pt-2 font-semibold">
									<a
										onClick={() => setTab(0)}
										className={`tab tab-bordered flex pb-9 ${
											tab === 0 ? "tab-active" : null
										}`}
									>
										Home
									</a>
									<a
										onClick={() => setTab(1)}
										className={`tab tab-bordered pb-9 ${
											tab === 1 ? "tab-active" : null
										}`}
									>
										About
									</a>
									<a
										onClick={() => setTab(2)}
										className={`tab tab-bordered pb-9 ${
											tab === 2 ? "tab-active" : null
										}`}
									>
										Jobs
									</a>
								</div>
							</div>
						</div>
						<div className="bg-base-100 border border-base-300 rounded-lg p-5">
							<Link
								href={{
									pathname: "/job-posting/new",
									query: {
										_id: company.data._id,
										uniqueAddress: company.data.uniqueAddress,
										name: company.data.name,
										picturePath: company.data.picturePath,
										city: company.data.city,
										country: company.data.country,
									},
								}}
							>
								<span className="font-semibold link link-hover text-blue-600">
									Create a new job posting
								</span>
							</Link>
						</div>
						{handleRenderTab()}
					</div>
					<div className="flex flex-col gap-3 w-full md:flex-none lg:w-1/4">
						<People randomUsers={randomUsers.data} />
					</div>
				</div>

				<EditPageModal
					company={company.data}
					isOpen={editPageModal}
					setIsOpen={setEditPageModal}
					createUpdateMutation={createUpdateMutation}
				/>
				<PagePictureModal
					company={company.data}
					isOpen={pagePictureModal}
					setIsOpen={setPagePictureModal}
				/>
			</div>
		);
};

export default OwnPage;
