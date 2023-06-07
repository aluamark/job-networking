import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";
import { useRandomUsersQuery } from "@/lib/react-query-hooks/useRandomUsersQuery";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import People from "@/components/widgets/People";
import JobTimeDifference from "@/components/job/JobTimeDifference";
import Loading from "@/components/widgets/Loading";

const PostedJobs = () => {
	const user = useLoggedUserQuery();
	const randomUsers = useRandomUsersQuery();

	if (user.isLoading) return <Loading />;

	if (user.data)
		return (
			<div className="max-w-screen-xl flex flex-col md:flex-row gap-5 mx-auto py-20 md:px-5">
				<Head>
					<title>Posted Jobs | EmployX</title>
				</Head>
				<div className="flex flex-col flex-none w-full md:w-[225px]">
					<div className="md:fixed md:w-[225px] font-semibold text-sm">
						<div className="flex flex-col divide-y divide-base-300 bg-base-100 border border-base-300 md:rounded-t-lg">
							<div className="flex gap-3 px-3 py-5">
								<BsFillBookmarkCheckFill className="h-5 w-5" />
								<span>My Items</span>
							</div>

							<div>
								<Link
									href="/my-items/saved-jobs"
									className="flex justify-between items-center gap-3 p-3"
								>
									<span>Saved jobs</span>
									<span>{user.data.savedJobs.length}</span>
								</Link>
							</div>

							<div>
								<Link
									href="/my-items/applied-jobs"
									className="flex justify-between items-center gap-3 p-3"
								>
									<span>Applied jobs</span>
									<span>{user.data.jobApplications.length}</span>
								</Link>
							</div>

							<div>
								<Link
									href="/my-items/posted-jobs"
									className="flex justify-between items-center gap-3 p-3 border-l-8 text-blue-600 border-blue-600"
								>
									<span>Posted jobs</span>
									<span>{user.data.postedJobs.length}</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col lg:flex-row gap-5 w-full">
					<div className="w-full">
						<div className="bg-base-100 border border-base-300 rounded-lg p-5">
							<span className="font-semibold">Posted</span>
							{user.data.postedJobs && user.data.postedJobs.length === 0 ? (
								<div className="pt-3">
									<span>No posted jobs.</span>
								</div>
							) : (
								<div className="flex flex-col divide-y divide-base-300 pt-3">
									{user.data.postedJobs &&
										user.data.postedJobs
											.slice()
											.reverse()
											.map((job) => (
												<Link
													href={`/hiring/jobs/${job._id}/applicants/${
														job?.applications[0]?.applicant
															? job?.applications[0]?.applicant
															: "0"
													}`}
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
															alt={job.company.name}
															width={56}
															height={56}
														/>
													</div>

													<div className="flex flex-col gap-1">
														<div className="flex flex-col">
															<span className="group-hover/job:underline text-blue-600 font-semibold">
																{job.title}
															</span>
															<span className="text-sm">
																{job.company.name}
															</span>
															<span className="text-sm text-zinc-500">
																{job.city}, {job.country} ({job.locationType})
															</span>
														</div>

														<div className="text-xs">
															<span className="text-green-600 font-semibold">
																Active
															</span>{" "}
															<span className="text-zinc-500">
																· Posted{" "}
																<JobTimeDifference date={job.createdAt} />
															</span>
														</div>
														<span className="text-xs text-zinc-500">
															{job.applications.length}{" "}
															{job.applications.length > 1
																? "applicants"
																: "applicant"}
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

export default PostedJobs;
