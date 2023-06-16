import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSearchQuery } from "@/lib/react-query-hooks/useSearchQuery";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";
import JobView from "@/components/job/JobView";
import JobViewModal from "@/components/job/JobViewModal";
import JobTimeDifference from "@/components/job/JobTimeDifference";
import Loading from "@/components/widgets/Loading";
import { BsCaretDownFill } from "react-icons/bs";
import Checkbox from "@/components/form/Checkbox";

const Search = () => {
	const router = useRouter();
	const { keywords, currentJobId, JT, LT } = router.query;
	const [selectedJob, setSelectedJob] = useState(null);
	const [jobViewModal, setJobViewModal] = useState(false);

	const user = useLoggedUserQuery();
	const search = useSearchQuery(keywords ? encodeURIComponent(keywords) : "");
	const [jobs, setJobs] = useState([]);

	const [jobType, setJobType] = useState({
		fullTime: false,
		partTime: false,
		contract: false,
		temporary: false,
		internship: false,
		volunteer: false,
	});

	const [locationType, setLocationType] = useState({
		onSite: false,
		hybrid: false,
		remote: false,
	});

	const handleCheckboxChange = (key) => {
		if (key in jobType) {
			setJobType((prevJobType) => ({
				...prevJobType,
				[key]: !prevJobType[key],
			}));
		}

		if (key in locationType) {
			setLocationType((prevLocationType) => ({
				...prevLocationType,
				[key]: !prevLocationType[key],
			}));
		}
	};

	const handleShowResults = () => {
		const filters = [];

		if (jobType.fullTime) {
			filters.push("FT");
		}

		if (jobType.partTime) {
			filters.push("PT");
		}
		if (jobType.contract) {
			filters.push("C");
		}
		if (jobType.temporary) {
			filters.push("T");
		}

		if (jobType.internship) {
			filters.push("I");
		}
		if (jobType.volunteer) {
			filters.push("V");
		}

		if (
			!jobType.fullTime &&
			!jobType.partTime &&
			!jobType.contract &&
			!jobType.temporary &&
			!jobType.internship &&
			!jobType.volunteer
		) {
			router.push(`/jobs/search?keywords=${encodeURIComponent(keywords)}`);
		} else {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&JT=${filters.join("-")}`
			);
		}
	};

	useEffect(() => {
		if (search.data) {
			const allJobs = [...search.data.jobsByTitle, ...search.data.jobsBySkills];
			const jobIdSet = new Set();
			const uniqueJobs = [];

			for (const job of allJobs) {
				const jobId = job._id;

				if (!jobIdSet.has(jobId)) {
					jobIdSet.add(jobId);
					uniqueJobs.push(job);
				}
			}

			if (JT) {
				let filteredJobs = [];
				const jobTypeQuery = JT.split("-");
				const filteredJobType = {
					fullTime: false,
					partTime: false,
					contract: false,
					temporary: false,
					internship: false,
					volunteer: false,
				};

				if (jobTypeQuery.includes("FT")) {
					const fullTimeJobs = uniqueJobs.filter(
						(job) => job.employmentType === "Full-time"
					);
					filteredJobs = [...filteredJobs, ...fullTimeJobs];
					filteredJobType.fullTime = true;
				}
				if (jobTypeQuery.includes("PT")) {
					const partTimeJobs = uniqueJobs.filter(
						(job) => job.employmentType === "Part-time"
					);
					filteredJobs = [...filteredJobs, ...partTimeJobs];
					filteredJobType.partTime = true;
				}
				if (jobTypeQuery.includes("C")) {
					const contractJobs = uniqueJobs.filter(
						(job) => job.employmentType === "Contract"
					);
					filteredJobs = [...filteredJobs, ...contractJobs];
					filteredJobType.contract = true;
				}
				if (jobTypeQuery.includes("T")) {
					const temporaryJobs = uniqueJobs.filter(
						(job) => job.employmentType === "Temporary"
					);
					filteredJobs = [...filteredJobs, ...temporaryJobs];
					filteredJobType.temporary = true;
				}

				if (jobTypeQuery.includes("I")) {
					const internshipJobs = uniqueJobs.filter(
						(job) => job.employmentType === "Internship"
					);
					filteredJobs = [...filteredJobs, ...internshipJobs];
					filteredJobType.internship = true;
				}
				if (jobTypeQuery.includes("V")) {
					const volunteerJobs = uniqueJobs.filter(
						(job) => job.employmentType === "Volunteer"
					);
					filteredJobs = [...filteredJobs, ...volunteerJobs];
					filteredJobType.volunteer = true;
				}

				setJobType(filteredJobType);
				setJobs(
					filteredJobs.sort(
						(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
					)
				);
				setSelectedJob(jobs[0]);
			} else {
				setJobs(
					uniqueJobs.sort(
						(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
					)
				);
				setSelectedJob(jobs[0]);
			}
		}
	}, [search.data, JT]);

	const handleJobClick = (job) => {
		setSelectedJob(job);
		setJobViewModal(true);

		if (JT) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&JT=${JT}&currentJobId=${job._id}`
			);
		} else {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(keywords)}&currentJobId=${
					job._id
				}`
			);
		}
	};

	useEffect(() => {
		if (currentJobId) {
			const job = jobs.find((job) => job._id === currentJobId);
			setSelectedJob(job);
		} else if (jobs.length !== 0 && JT && !currentJobId) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&JT=${JT}&currentJobId=${jobs[jobs.length - 1]._id}`
			);
		} else if (jobs.length === 0 && JT) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(keywords)}&JT=${JT}`
			);
		} else if (jobs.length !== 0 && !JT && !currentJobId) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(keywords)}&currentJobId=${
					jobs[jobs.length - 1]._id
				}`
			);
		}
	}, [jobs, JT, currentJobId]);

	if (search.isLoading) return <Loading />;

	if (search.data)
		return (
			<div>
				<Head>
					<title>{keywords} | EmployX</title>
				</Head>
				<div className="fixed top-[4rem] bg-base-100 border-b border-base-300 w-full z-40 shadow-lg">
					<div className="max-w-screen-xl mx-auto flex items-center py-3 divide-x divide-base-300">
						<div className="px-5">Jobs</div>
						<div className="flex gap-2.5 px-3">
							<details className="dropdown">
								<summary
									tabIndex={0}
									className="flex items-center gap-1 border border-base-300 rounded-full px-3 py-1 cursor-pointer"
								>
									Job type <BsCaretDownFill />
								</summary>
								<ul
									tabIndex={0}
									className="dropdown-content menu rounded-lg shadow bg-base-100 w-52 border border-base-300"
								>
									<div className="px-2">
										<Checkbox
											label="Full-time"
											checked={jobType.fullTime}
											onChange={() => handleCheckboxChange("fullTime")}
										/>
										<Checkbox
											label="Part-time"
											checked={jobType.partTime}
											onChange={() => handleCheckboxChange("partTime")}
										/>
										<Checkbox
											label="Contract"
											checked={jobType.contract}
											onChange={() => handleCheckboxChange("contract")}
										/>
										<Checkbox
											label="Temporary"
											checked={jobType.temporary}
											onChange={() => handleCheckboxChange("temporary")}
										/>
										<Checkbox
											label="Internship"
											checked={jobType.internship}
											onChange={() => handleCheckboxChange("internship")}
										/>
										<Checkbox
											label="Volunteer"
											checked={jobType.volunteer}
											onChange={() => handleCheckboxChange("volunteer")}
										/>
									</div>
									<div className="flex justify-end border-t border-base-300 p-2">
										<button
											onClick={handleShowResults}
											className="bg-blue-600 rounded-full px-3 py-1 text-sm text-white font-semibold"
										>
											Show Results
										</button>
									</div>
								</ul>
							</details>
							{/* <details className="dropdown dropdown-bottom dropdown-end flex items-center">
								<summary
									tabIndex={0}
									className="flex items-center gap-1 border border-base-300 rounded-full px-3 py-1 cursor-pointer"
								>
									On-site/remote <BsCaretDownFill />
								</summary>
								<ul
									tabIndex={0}
									className="dropdown-content menu shadow bg-base-100 rounded-box w-52 border border-base-300"
								>
									<div className="px-2">
										<Checkbox
											label="On-site"
											checked={locationType.onSite}
											onChange={() => handleCheckboxChange("onSite")}
										/>
										<Checkbox
											label="Remote"
											checked={locationType.remote}
											onChange={() => handleCheckboxChange("remote")}
										/>
										<Checkbox
											label="Hybrid"
											checked={locationType.hybrid}
											onChange={() => handleCheckboxChange("hybrid")}
										/>
									</div>
									<div className="flex justify-end border-t border-base-300 p-2">
										<button
											onClick={handleShowResults}
											className="bg-blue-600 rounded-full px-3 py-1 text-sm text-white font-semibold"
										>
											Show Results
										</button>
									</div>
								</ul>
							</details> */}
						</div>
					</div>
				</div>
				<div className="fixed top-[7.6rem] w-full h-full">
					<div className="max-w-screen-xl mx-auto flex z-0 divide-x divide-base-300 bg-base-100 border-x border-base-300 h-full">
						<div className="w-full h-[88%] pb-[6.52rem] md:pb-0">
							<div className="flex flex-col h-full overflow-auto border-b border-base-300">
								<div className="divide-y divide-base-300 border-b border-base-300">
									{jobs.length !== 0 && selectedJob ? (
										jobs
											.slice()
											.reverse()
											.map((job) => (
												<div
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
												</div>
											))
									) : (
										<div className="p-5 font-semibold">
											No matching jobs found.
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="hidden md:flex w-full h-[88%] overflow-y-auto border-b border-base-300">
							{selectedJob && (
								<JobView selectedJob={selectedJob} user={user.data} />
							)}
						</div>
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

export default Search;
