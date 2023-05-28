import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";
import { getTimeDifference } from "@/lib/helper";
import { PuffLoader } from "react-spinners";
import People from "@/components/widgets/People";
import { useRandomUsersQuery } from "@/lib/react-query-hooks/useRandomUsersQuery";

const index = () => {
	const user = useLoggedUserQuery();
	const randomUsers = useRandomUsersQuery();

	if (user.isLoading)
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-10">
				<span className="text-5xl font-extrabold text-blue-600">GetHired</span>
				<PuffLoader />
			</div>
		);

	if (user.data)
		return (
			<div className="max-w-screen-xl flex flex-col md:flex-row gap-5 mx-auto py-20 md:px-5">
				<Head>
					<title>Jobs | GetHired</title>
				</Head>
				<div className="flex flex-col flex-none w-full md:w-[225px]">
					<div className="md:fixed md:w-[225px] flex flex-col gap-5 bg-base-100 border border-base-300 rounded-lg p-5 font-semibold text-sm">
						My items
					</div>
				</div>
				<div className="flex flex-col lg:flex-row gap-5 w-full">
					<div className="w-full">
						<div className="bg-base-100 border border-base-300 rounded-lg p-5">
							<span className="font-semibold">Saved</span>
							{user.data.savedJobs && user.data.savedJobs.length === 0 ? (
								<div className="pt-3">
									<span>No saved jobs.</span>
								</div>
							) : (
								<div className="flex flex-col divide-y divide-base-300 pt-3">
									{user.data.savedJobs &&
										user.data.savedJobs
											.slice()
											.reverse()
											.map((job) => (
												<Link
													href={`/jobs/view/${job._id}`}
													key={job._id}
													className="flex gap-5 py-3 group/job"
												>
													<div className="flex-none">
														<Image
															src={job.company.picturePath}
															width={56}
															height={56}
														/>
													</div>

													<div className="flex flex-col">
														<span className="group-hover/job:underline text-blue-600 font-semibold">
															{job.title}
														</span>
														<span className="text-sm">{job.company.name}</span>
														<span className="text-sm text-zinc-500">
															{job.city}, {job.country} ({job.locationType})
														</span>
														<span className="text-green-600 text-xs font-semibold pt-1.5">
															{getTimeDifference(job.createdAt)}
														</span>
													</div>
												</Link>
											))}
								</div>
							)}
						</div>
					</div>
					<div>
						<div className="w-full lg:w-[300px]">
							<People
								randomUsers={randomUsers.data}
								userEmail={user.data.email}
							/>
						</div>
					</div>
				</div>
			</div>
		);
};

export default index;
