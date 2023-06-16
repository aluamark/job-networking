import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";
import { useJobsQuery } from "@/lib/react-query-hooks/useJobsQuery";
import { getRecommendedJobs } from "@/lib/helper";
import JobView from "@/components/job/JobView";
import JobViewModal from "@/components/job/JobViewModal";
import JobTimeDifference from "@/components/job/JobTimeDifference";
import Loading from "@/components/widgets/Loading";

const Recommended = () => {
	const router = useRouter();
	const { currentJobId } = router.query;
	const [recommendedJobs, setRecommendedJobs] = useState(null);
	const [selectedJob, setSelectedJob] = useState(null);
	const [jobViewModal, setJobViewModal] = useState(false);

	const user = useLoggedUserQuery();
	const jobs = useJobsQuery();

	const handleJobClick = (job) => {
		setSelectedJob(job);
		setJobViewModal(true);
		router.push(`/jobs/collections/recommended?currentJobId=${job._id}`);
	};

	useEffect(() => {
		if (jobs.data && user.data) {
			setRecommendedJobs(getRecommendedJobs(user.data, jobs.data));
		}
	}, [jobs.data, user.data]);

	const handleJobSelection = () => {
		const job = recommendedJobs.find((job) => job._id === currentJobId);
		setSelectedJob(job);
	};

	useEffect(() => {
		if (recommendedJobs && currentJobId) {
			handleJobSelection();
		}
	}, [jobs.data, recommendedJobs, currentJobId]);

	if (jobs.isLoading) return <Loading />;

	if (selectedJob)
		return (
			<div className="min-h-screen h-screen max-w-screen-xl mx-auto flex md:px-5">
				<Head>
					<title>Jobs based on your Profile | EmployX</title>
				</Head>
				<div className="h-[91.8%] flex divide-x divide-base-300 my-20 bg-base-100 border border-base-300 md:rounded-t-lg w-full">
					<div className="relative flex-1 h-full">
						<div className="sticky top-0 bg-blue-700 p-2.5 md:rounded-tl-lg">
							<span className="text-white">Jobs based on your Profile</span>
						</div>
						<div className="w-full h-[95.7%] pb-[4rem] md:pb-0">
							<ul className="flex flex-col h-full overflow-y-auto">
								<div className="divide-y divide-base-300 border-b border-base-300">
									{recommendedJobs &&
										recommendedJobs.map((job) => (
											<li
												onClick={() => handleJobClick(job)}
												key={job._id}
												className={`flex gap-5 py-3 px-2.5 cursor-pointer group/job ${
													job._id === selectedJob._id && "bg-sky-50"
												}`}
											>
												<div className="flex-none">
													<Image
														src={
															job.company.picturePath
																? job.company.picturePath
																: "/company.png"
														}
														alt="company-logo"
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
														<JobTimeDifference date={job.createdAt} />
													</span>
												</div>
											</li>
										))}
								</div>
							</ul>
						</div>
					</div>
					<div className="hidden md:flex flex-1 h-full overflow-y-auto">
						{selectedJob && (
							<JobView selectedJob={selectedJob} user={user.data} />
						)}
					</div>
				</div>
				{selectedJob && (
					<JobViewModal
						isOpen={jobViewModal}
						setIsOpen={setJobViewModal}
						selectedJob={selectedJob}
						user={user.data}
					/>
				)}
			</div>
		);
};

export default Recommended;
