import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import JobTimeDifference from "./JobTimeDifference";
import ResumeViewModal from "@/components/job/ResumeViewModal";

const AppliedJob = ({ application }) => {
	const [resumeModal, setResumeModal] = useState(false);

	return (
		<div className="flex gap-5 py-3">
			<div className="flex-none">
				<Link href={`/jobs/view/${application.job._id}`}>
					<Image
						src={
							application.job.company.picturePath
								? application.job.company.picturePath
								: "/company.png"
						}
						alt={application.job.company.name}
						width={56}
						height={56}
					/>
				</Link>
			</div>

			<div className="flex flex-col">
				<div>
					<Link
						href={`/jobs/view/${application.job._id}`}
						className="link link-hover text-blue-600 font-semibold"
					>
						{application.job.title}
					</Link>
				</div>
				<div>
					<Link
						href={`/company/${application.job.company.uniqueAddress}`}
						className="text-xs link link-hover hover:text-blue-600"
					>
						{application.job.company.name}
					</Link>
					{" · "}
					<span className="text-xs text-zinc-500">
						{application.job.city}, {application.job.country} (
						{application.job.locationType})
					</span>
				</div>

				<div className="flex flex-col text-sm pt-1.5">
					<span className="font-semibold">Submitted info</span>
					<span>Email: {application.email}</span>
					<span>Phone: {application.phone}</span>
					<span>
						Resume:{" "}
						<button
							onClick={() => setResumeModal(true)}
							className="link link-hover text-blue-600"
						>
							View submitted resume
						</button>
					</span>
				</div>
				<span className="text-green-600 text-xs font-semibold pt-1.5">
					Applied <JobTimeDifference date={application.createdAt} />
				</span>
			</div>
			<ResumeViewModal
				isOpen={resumeModal}
				setIsOpen={setResumeModal}
				resume={application.resume}
			/>
		</div>
	);
};

export default AppliedJob;
