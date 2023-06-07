import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useJobQuery } from "@/lib/react-query-hooks/useJobQuery";
import { getTimeDifference } from "@/lib/helper";
import JobTimeDifference from "@/components/job/JobTimeDifference";
import ApplicationView from "@/components/job/ApplicationView";
import ApplicationViewModal from "@/components/job/ApplicationViewModal";
import Loading from "@/components/widgets/Loading";

const ManageApplicants = () => {
	const router = useRouter();
	const { jobId, userId } = router.query;
	const [selectedApplication, setSelectedApplication] = useState(null);
	const [applicationViewModal, setApplicationViewModal] = useState(false);

	const job = useJobQuery(jobId);

	const handleApplicationClick = (application) => {
		setSelectedApplication(application);
		setApplicationViewModal(true);
		router.push(
			`/hiring/jobs/${jobId}/applicants/${application.applicant._id}`
		);
	};

	useEffect(() => {
		if (job.data && userId) {
			const application = job.data.applications.find(
				(application) => application.applicant._id === userId
			);
			setSelectedApplication(application);
		}
	}, [job.data, userId]);

	if (job.isLoading) return <Loading />;

	if (job.data)
		return (
			<>
				<div className="fixed top-[4rem] bg-base-100 border-b border-base-300 w-full z-40">
					<Head>
						<title>Applications for {job.data.title} | EmployX</title>
					</Head>
					<div className="max-w-screen-xl mx-auto flex items-center gap-3 py-3 px-3">
						<div className="flex-none">
							<Image
								src={
									job.data.company.picturePath
										? job.data.company.picturePath
										: "/company.png"
								}
								width={48}
								height={48}
								alt="company-logo"
							/>
						</div>

						<div className="flex flex-col">
							<span className="font-semibold">{job.data.title}</span>
							<span className="text-xs">
								{job.data.company.name}{" "}
								{job.data.company.country && `· ${job.data.company.country}`}
							</span>
							<div className="text-xs">
								<span className="text-green-600 font-semibold">Active</span>{" "}
								<span className="text-zinc-500">
									· Posted <JobTimeDifference date={job.data.createdAt} />
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="fixed top-[9rem] w-full h-full">
					<div className="max-w-screen-xl mx-auto flex z-0 divide-x divide-base-300 bg-base-100 border border-base-300 h-full">
						<div className="w-full h-[85%]">
							<div className="sticky top-0 px-5 py-2.5 border-b border-base-300">
								<span className="font-semibold">
									{job.data.applications.length}{" "}
									{job.data.applications.length > 1
										? "applicants"
										: "applicant"}
								</span>
							</div>
							<div className="flex flex-col divide-y divide-base-300 h-[94.7%] border-b border-base-300 overflow-y-auto">
								{job.data.applications.map((application) => (
									<div
										key={application._id}
										onClick={() => handleApplicationClick(application)}
										className="flex gap-3 px-5 py-3 cursor-pointer"
									>
										<div className="flex-none">
											<Image
												src={
													application.applicant.picturePath
														? application.applicant.picturePath
														: "/default.png"
												}
												width={42}
												height={42}
												alt={`${application.applicant.firstName} ${application.applicant.lastName}`}
												className="rounded-full border border-base-300"
											/>
										</div>

										<div className="flex flex-col gap-1.5">
											<span className="font-semibold">
												{application.applicant.firstName}{" "}
												{application.applicant.lastName}
											</span>
											{application.applicant.headline && (
												<span className="text-xs text-zinc-500">
													{application.applicant.headline}
												</span>
											)}

											<span className="text-sm text-zinc-500">
												Applied {getTimeDifference(application.createdAt)}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="hidden md:flex w-full h-[85%] overflow-y-auto border-b border-base-300">
							{selectedApplication && (
								<ApplicationView selectedApplication={selectedApplication} />
							)}
						</div>
					</div>
				</div>
				{selectedApplication && (
					<ApplicationViewModal
						isOpen={applicationViewModal}
						setIsOpen={setApplicationViewModal}
						selectedApplication={selectedApplication}
					/>
				)}
			</>
		);
};

export default ManageApplicants;
