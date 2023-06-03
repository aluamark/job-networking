import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";
import { useJobsQuery } from "@/lib/react-query-hooks/useJobsQuery";
import { useRandomUsersQuery } from "@/lib/react-query-hooks/useRandomUsersQuery";
import { getRecommendedJobs, getTimeDifference } from "@/lib/helper";
import {
	BsFillBookmarkCheckFill,
	BsBellFill,
	BsGearFill,
	BsFileEarmark,
	BsBriefcaseFill,
} from "react-icons/bs";
import People from "../widgets/People";
import { PuffLoader } from "react-spinners";

const UserJobs = () => {
	const [recommendedJobs, setRecommendedJobs] = useState(null);

	const user = useLoggedUserQuery();
	const jobs = useJobsQuery();
	const randomUsers = useRandomUsersQuery();

	useEffect(() => {
		if (jobs.data && user?.data) {
			setRecommendedJobs(getRecommendedJobs(user.data, jobs.data));
		}
	}, [jobs.data, user?.data]);

	if (user?.isLoading || jobs.isLoading || randomUsers.isLoading)
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-10">
				<span className="text-5xl font-extrabold text-blue-600">GetHired</span>
				<PuffLoader />
			</div>
		);

	if (user.data && jobs.data && randomUsers.data)
		return (
			<div className="max-w-screen-xl flex flex-col md:flex-row gap-5 mx-auto py-20 md:px-5">
				<Head>
					<title>Jobs | GetHired</title>
				</Head>
				<div className="flex flex-col flex-none w-full md:w-[225px]">
					<div className="md:fixed md:w-[225px] flex flex-col gap-3 font-semibold text-sm">
						<div className="flex flex-col gap-7 bg-base-100 border border-base-300 rounded-lg px-5 py-7">
							<Link
								href="/my-items/saved-jobs"
								className="flex items-center gap-3"
							>
								<BsFillBookmarkCheckFill className="h-5 w-5" />
								My jobs
							</Link>
							<Link href="/jobs" className="flex items-center gap-3">
								<BsBellFill className="h-5 w-5" />
								Job alerts
							</Link>
							<Link href="/jobs" className="flex items-center gap-3">
								<BsFileEarmark className="h-5 w-5" />
								Resume builder
							</Link>
							<Link href="/jobs" className="flex items-center gap-3">
								<BsGearFill className="h-5 w-5" />
								Application settings
							</Link>
						</div>
						{user.data.postedJobs.length !== 0 && (
							<Link
								href="/my-items/posted-jobs"
								className="flex gap-3 bg-base-100 border border-base-300 rounded-lg p-5"
							>
								<BsBriefcaseFill className="h-5 w-5" />
								Manage job posts
							</Link>
						)}
					</div>
				</div>
				<div className="flex flex-col lg:flex-row gap-5 w-full">
					<div className="w-full">
						<div className="bg-base-100 border border-base-300 rounded-lg p-5">
							<span className="font-semibold">Recommended for you</span>
							<p className="text-sm text-zinc-500">
								Based on your profile skills
							</p>
							{recommendedJobs && recommendedJobs.length === 0 ? (
								<div className="pt-3">
									<span>
										No job available. Add more skills to match more jobs.
									</span>
								</div>
							) : (
								<div className="flex flex-col divide-y divide-base-300 pt-3">
									{recommendedJobs &&
										recommendedJobs.map((job) => (
											<Link
												href={{
													pathname: "/jobs/collections/recommended/",
													query: {
														currentJobId: job._id,
													},
												}}
												key={job._id}
												className="flex gap-5 py-3 group/job"
											>
												<div className="flex-none">
													<Image
														src={
															job.company.picturePath
																? job.company.picturePath
																: "/company.png"
														}
														width={56}
														height={56}
														alt="company-logo"
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

export default UserJobs;
