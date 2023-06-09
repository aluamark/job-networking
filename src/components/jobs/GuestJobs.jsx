import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import JobView from "../job/JobView";
import JobViewModal from "../job/JobViewModal";
import JobTimeDifference from "../job/JobTimeDifference";
import { useJobsQuery } from "@/lib/react-query-hooks/useJobsQuery";
import Loading from "../widgets/Loading";

const GuestJobs = () => {
	const [selectedJob, setSelectedJob] = useState(null);
	const [jobViewModal, setJobViewModal] = useState(false);

	const jobs = useJobsQuery();

	const handleJobClick = (job) => {
		setSelectedJob(job);
		setJobViewModal(true);
	};

	useEffect(() => {
		if (jobs.data) {
			setSelectedJob(jobs.data[0]);
		}
	}, [jobs.data]);

	if (jobs.isLoading) return <Loading />;

	if (jobs.data && jobs.data.length === 0)
		return (
			<div className="max-w-screen-sm mx-auto py-20 md:px-5">
				<div className="flex flex-col gap-3 bg-base-100 border border-base-300 p-5 rounded-lg">
					<p className="text-xl font-semibold">
						No jobs available at the moment.
					</p>
					<p>
						Stay tuned as we onboard companies and new job postings will appear
						soon!
					</p>
				</div>
			</div>
		);

	if (selectedJob)
		return (
			<div className="min-h-screen h-screen max-w-screen-xl mx-auto flex divide-x divide-base-300 py-[4rem] md:pb-0 bg-base-100">
				<Head>
					<title>Jobs | EmployX</title>
				</Head>
				<div className="flex-1 overflow-y-auto border-l border-base-300">
					<ul className="flex flex-col divide-y divide-base-300">
						{jobs.data &&
							jobs.data
								.slice()
								.reverse()
								.map((job) => (
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
												<JobTimeDifference date={job.createdAt} />
											</span>
										</div>
									</li>
								))}
					</ul>
				</div>

				<div className="hidden md:flex flex-1 overflow-y-auto">
					{selectedJob && <JobView selectedJob={selectedJob} />}
				</div>
				{selectedJob && (
					<JobViewModal
						isOpen={jobViewModal}
						setIsOpen={setJobViewModal}
						selectedJob={selectedJob}
					/>
				)}
			</div>
		);
};

export default GuestJobs;
