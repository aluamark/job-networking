import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveJob, renderDescription } from "@/lib/helper";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { BsBriefcaseFill, BsListCheck, BsArrowLeftShort } from "react-icons/bs";
import JobSkillsModal from "@/components/job/JobSkillsModal";
import JobApplicationModal from "@/components/job/JobApplicationModal";
import JobTimeDifference from "@/components/job/JobTimeDifference";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";
import { useJobQuery } from "@/lib/react-query-hooks/useJobQuery";

const View = () => {
	const router = useRouter();
	const { jobId } = router.query;
	const queryClient = useQueryClient();
	const [skillsModal, setSkillsModal] = useState(false);
	const [jobApplicationModal, setJobApplicationModal] = useState(false);

	const user = useLoggedUserQuery();
	const job = useJobQuery(jobId);

	const createUpdateMutation = useMutation({
		mutationFn: saveJob,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["loggedUser"],
			});
		},
	});

	const handleSaveJob = async () => {
		try {
			createUpdateMutation.mutate(
				{
					userId: user.data._id,
					jobId: job.data._id,
				},
				{
					onSuccess: (response) => {
						const { message } = response.data;
						toast.success(message);
					},
				}
			);
		} catch (error) {
			toast.error("Save failed");
		}
	};

	if (job.isLoading || user.isLoading)
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-10">
				<span className="text-5xl font-extrabold text-blue-600">GetHired</span>
				<PuffLoader />
			</div>
		);

	if (job.isError || user.isError) {
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-3">
				<h2 className="text-3xl font-bold flex gap-1">
					<span className="text-error">Job not found</span>
				</h2>
				<p>Please check your URL or return to Jobs.</p>
				<Link href="/jobs">
					<button className="box-border border border-blue-500 text-blue-500 px-4 py-1 transition duration-300 hover:bg-blue-100 hover:border-2 rounded-full h-10 mt-2">
						Go to Jobs
					</button>
				</Link>
			</div>
		);
	}

	if (job.data && user.data)
		return (
			<div className="max-w-screen-xl mx-auto flex flex-col gap-3 py-20 md:px-5">
				<Head>
					<title>{job.data.title}</title>
				</Head>
				<div>
					<Link
						href="/my-items/saved-jobs"
						className="btn btn-outline btn-sm gap-2 normal-case lg:gap-3"
					>
						<BsArrowLeftShort className="w-7 h-7" />
						<span>Saved jobs</span>
					</Link>
				</div>

				<div className="flex flex-col gap-5 bg-base-100 border border-base-300 rounded-lg p-5">
					<Image
						src={
							job.data.company.picturePath
								? job.data.company.picturePath
								: "/company.png"
						}
						alt="company-logo"
						width={48}
						height={48}
					/>
					<div className="flex flex-col gap-1.5">
						<span className="text-2xl font-semibold">{job.data.title}</span>

						<div className="text-sm">
							<span>
								<Link
									href={`/company/${job.data.company.uniqueAddress}`}
									className="link link-hover hover:text-blue-600"
								>
									{job.data.company.name}
								</Link>{" "}
								· {job.data.city}, {job.data.country} ({job.data.locationType}){" "}
							</span>
							<span className="text-zinc-500">
								<JobTimeDifference date={job.data.createdAt} />
							</span>
						</div>
					</div>

					<div className="flex flex-col gap-2.5 text-sm">
						{job.data.employmentType && (
							<div className="flex items-center gap-3">
								<BsBriefcaseFill className="h-5 w-5" />
								{job.data.employmentType}
							</div>
						)}

						{job.data.skills.length !== 0 && (
							<button
								onClick={() => setSkillsModal(true)}
								className="flex items-center gap-3"
							>
								<BsListCheck className="h-5 w-5" />
								Skills:{" "}
								{job.data.skills.length > 2
									? `${job.data.skills[0]}, ${job.data.skills[1]}, +${
											job.data.skills.length - 2
									  } more`
									: job.data.skills === 1
									? `${job.data.skills[0]}`
									: `${job.data.skills[0]}, ${job.data.skills[1]}`}
							</button>
						)}
					</div>
					<div className="flex gap-1.5">
						{user.data.jobApplications.some(
							(application) => application.job._id === job.data._id
						) ? (
							<button
								disabled
								className="bg-blue-900 text-white px-5 rounded-full font-semibold disabled"
							>
								Applied
							</button>
						) : (
							<button
								onClick={() => setJobApplicationModal(true)}
								className="bg-blue-700 hover:bg-blue-800 text-white px-5 rounded-full font-semibold"
							>
								Apply
							</button>
						)}
						{user.data.savedJobs.some(
							(savedJob) => savedJob._id === job.data._id
						) ? (
							<button
								onClick={handleSaveJob}
								className="h-10 w-24 box-border hover:box-border border border-blue-600 hover:bg-blue-50 duration-300 hover:border-2 text-blue-600 px-5 rounded-full font-semibold"
							>
								Saved
							</button>
						) : (
							<button
								onClick={handleSaveJob}
								className="h-10 w-20 box-border hover:box-border border border-blue-600 hover:bg-blue-50 duration-300 hover:border-2 text-blue-600 px-5 rounded-full font-semibold"
							>
								Save
							</button>
						)}
					</div>
				</div>

				{job.data.postedBy && (
					<div className="flex flex-col gap-2.5 bg-base-100 border border-base-300 rounded-lg px-5 pt-3 pb-5">
						<span className="text-lg font-semibold">Meet the hiring team</span>
						<div className="flex gap-1.5">
							<Link
								href={`/gh/${job.data.postedBy.email}`}
								className="flex-none"
							>
								<Image
									src={
										job.data.postedBy.picturePath
											? job.data.postedBy.picturePath
											: "/default.png"
									}
									alt="hiring-member-photo"
									className="w-[56px] h-[56px] rounded-full object-cover"
									width={56}
									height={56}
								/>
							</Link>
							<div className="flex flex-col text-sm">
								<Link
									href={`/gh/${job.data.postedBy.email}`}
									className="link link-hover"
								>
									<span className="font-semibold">
										{job.data.postedBy.firstName} {job.data.postedBy.lastName}
									</span>
								</Link>

								<span>{job.data.postedBy.headline}Senior HR Executive</span>
								<span className="text-xs text-zinc-500">Job poster</span>
							</div>
						</div>
					</div>
				)}

				<div className="flex flex-col gap-5 bg-base-100 border border-base-300 rounded-lg p-5">
					<span className="text-lg font-semibold">About the job</span>
					<div className="text-sm">
						{renderDescription(job.data.description)}
					</div>
				</div>
				<JobSkillsModal
					isOpen={skillsModal}
					setIsOpen={setSkillsModal}
					skills={job.data.skills}
					user={user.data}
				/>
				<JobApplicationModal
					isOpen={jobApplicationModal}
					setIsOpen={setJobApplicationModal}
					user={user.data}
					selectedJob={job.data}
				/>
			</div>
		);
};

export default View;
