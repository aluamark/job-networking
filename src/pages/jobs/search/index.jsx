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
		FT: false,
		PT: false,
		C: false,
		T: false,
		I: false,
		V: false,
	});

	const [locationType, setLocationType] = useState({
		OS: false,
		H: false,
		R: false,
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
		const JTfilters = [];
		const LTfilters = [];

		if (jobType.FT) {
			JTfilters.push("FT");
		}
		if (jobType.PT) {
			JTfilters.push("PT");
		}
		if (jobType.C) {
			JTfilters.push("C");
		}
		if (jobType.T) {
			JTfilters.push("T");
		}
		if (jobType.I) {
			JTfilters.push("I");
		}
		if (jobType.V) {
			JTfilters.push("V");
		}

		if (locationType.OS) {
			LTfilters.push("OS");
		}
		if (locationType.R) {
			LTfilters.push("R");
		}
		if (locationType.H) {
			LTfilters.push("H");
		}

		const hasTrueValue = (obj) => Object.values(obj).includes(true);

		if (!hasTrueValue(jobType) && !hasTrueValue(locationType)) {
			router.push(`/jobs/search?keywords=${encodeURIComponent(keywords)}`);
		} else if (hasTrueValue(jobType) && !hasTrueValue(locationType)) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&JT=${JTfilters.join("-")}`
			);
		} else if (!hasTrueValue(jobType) && hasTrueValue(locationType)) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&LT=${LTfilters.join("-")}`
			);
		} else {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&JT=${JTfilters.join("-")}&LT=${LTfilters.join("-")}`
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

			if (JT && !LT) {
				const jobTypeQuery = JT.split("-");
				const filteredJobs = [];
				const filteredJobType = {
					FT: false,
					PT: false,
					C: false,
					T: false,
					I: false,
					V: false,
				};

				const jobTypeMapping = {
					FT: "Full-time",
					PT: "Part-time",
					C: "Contract",
					T: "Temporary",
					I: "Internship",
					V: "Volunteer",
				};

				jobTypeQuery.forEach((type) => {
					if (jobTypeMapping[type]) {
						const jobsOfType = uniqueJobs.filter(
							(job) => job.employmentType === jobTypeMapping[type]
						);
						filteredJobs.push(...jobsOfType);
						filteredJobType[type] = true;
					}
				});

				setJobType(filteredJobType);
				setJobs(
					filteredJobs.sort(
						(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
					)
				);

				if (filteredJobs.length !== 0) {
					setSelectedJob(filteredJobs[0]);
				} else {
					setSelectedJob(null);
				}
			} else if (!JT && LT) {
				const locationTypeQuery = LT.split("-");
				const filteredJobs = [];
				const filteredLocationType = {
					OS: false,
					H: false,
					R: false,
				};

				const locationTypeMapping = {
					OS: "On-site",
					R: "Remote",
					H: "Hybrid",
				};

				locationTypeQuery.forEach((type) => {
					if (locationTypeMapping[type]) {
						const jobsOfType = uniqueJobs.filter(
							(job) => job.locationType === locationTypeMapping[type]
						);
						filteredJobs.push(...jobsOfType);
						filteredLocationType[type] = true;
					}
				});

				setLocationType(filteredLocationType);
				setJobs(
					filteredJobs.sort(
						(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
					)
				);

				if (filteredJobs.length !== 0) {
					setSelectedJob(filteredJobs[0]);
				} else {
					setSelectedJob(null);
				}
			} else if (JT && LT) {
				const jobTypeQuery = JT.split("-");
				const locationTypeQuery = LT.split("-");

				const jobTypeMapping = {
					"Full-time": "FT",
					"Part-time": "PT",
					Contract: "C",
					Temporary: "T",
					Internship: "I",
					Volunteer: "V",
				};

				const locationTypeMapping = {
					"On-site": "OS",
					Remote: "R",
					Hybrid: "H",
				};

				const filteredJobs = uniqueJobs.filter((job) => {
					return (
						jobTypeQuery.includes(jobTypeMapping[job.employmentType]) &&
						locationTypeQuery.includes(locationTypeMapping[job.locationType])
					);
				});

				const filteredJobType = {
					FT: false,
					PT: false,
					C: false,
					T: false,
					I: false,
					V: false,
				};
				const filteredLocationType = {
					OS: false,
					H: false,
					R: false,
				};

				const jobTypes = {
					FT: "Full-time",
					PT: "Part-time",
					C: "Contract",
					T: "Temporary",
					I: "Internship",
					V: "Volunteer",
				};

				const locationTypes = {
					OS: "On-site",
					R: "Remote",
					H: "Hybrid",
				};

				jobTypeQuery.forEach((type) => {
					if (jobTypes[type]) {
						filteredJobType[type] = true;
					}
				});

				locationTypeQuery.forEach((type) => {
					if (locationTypes[type]) {
						filteredLocationType[type] = true;
					}
				});

				setJobType(filteredJobType);
				setLocationType(filteredLocationType);
				setJobs(
					filteredJobs.sort(
						(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
					)
				);

				if (filteredJobs.length !== 0) {
					setSelectedJob(filteredJobs[0]);
				} else {
					setSelectedJob(null);
				}
			} else {
				setJobType({
					FT: false,
					PT: false,
					C: false,
					T: false,
					I: false,
					V: false,
				});
				setLocationType({
					OS: false,
					H: false,
					R: false,
				});
				setJobs(
					uniqueJobs.sort(
						(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
					)
				);
				setSelectedJob(jobs[0]);
			}
		}
	}, [search.data, JT, LT]);

	const handleJobClick = (job) => {
		setSelectedJob(job);
		setJobViewModal(true);

		if (JT && !LT) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&JT=${JT}&currentJobId=${job._id}`
			);
		} else if (!JT && LT) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&LT=${LT}&currentJobId=${job._id}`
			);
		} else if (JT && LT) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&JT=${JT}&LT=${LT}&currentJobId=${job._id}`
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
		} else if (jobs.length !== 0 && JT && !LT && !currentJobId) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&JT=${JT}&currentJobId=${jobs[jobs.length - 1]._id}`
			);
		} else if (jobs.length === 0 && JT && !LT) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(keywords)}&JT=${JT}`
			);
		} else if (jobs.length !== 0 && !JT && LT && !currentJobId) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&LT=${LT}&currentJobId=${jobs[jobs.length - 1]._id}`
			);
		} else if (jobs.length === 0 && !JT && LT) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(keywords)}&LT=${LT}`
			);
		} else if (jobs.length !== 0 && JT && LT && !currentJobId) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&JT=${JT}&LT=${LT}&currentJobId=${jobs[jobs.length - 1]._id}`
			);
		} else if (jobs.length === 0 && JT && LT) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(
					keywords
				)}&JT=${JT}&LT=${LT}`
			);
		} else if (jobs.length !== 0 && !JT && !LT && !currentJobId) {
			router.push(
				`/jobs/search?keywords=${encodeURIComponent(keywords)}&currentJobId=${
					jobs[jobs.length - 1]._id
				}`
			);
		}
	}, [jobs, JT, LT, currentJobId]);

	if (search.isLoading) return <Loading />;

	if (search.data)
		return (
			<div>
				<Head>
					<title>{keywords} | EmployX</title>
				</Head>
				<div className="fixed top-[4rem] bg-base-100 border-b border-base-300 w-full z-40 shadow-lg">
					<div className="max-w-screen-xl mx-auto flex items-center py-3 divide-x divide-base-300">
						<div className="px-5 font-semibold">Jobs</div>
						<div className="flex gap-2.5 px-3">
							<details className="dropdown">
								<summary
									tabIndex={0}
									className={`flex justify-center items-center gap-1 w-28 h-9 box-border rounded-full px-3 py-1 cursor-pointer font-semibold ${
										jobType.FT ||
										jobType.PT ||
										jobType.C ||
										jobType.T ||
										jobType.I ||
										jobType.V
											? "bg-green-600 text-white"
											: "border hover:border-2 border-base-300 hover:bg-base-200 duration-150"
									}`}
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
											checked={jobType.FT}
											onChange={() => handleCheckboxChange("FT")}
										/>
										<Checkbox
											label="Part-time"
											checked={jobType.PT}
											onChange={() => handleCheckboxChange("PT")}
										/>
										<Checkbox
											label="Contract"
											checked={jobType.C}
											onChange={() => handleCheckboxChange("C")}
										/>
										<Checkbox
											label="Temporary"
											checked={jobType.T}
											onChange={() => handleCheckboxChange("T")}
										/>
										<Checkbox
											label="Internship"
											checked={jobType.I}
											onChange={() => handleCheckboxChange("I")}
										/>
										<Checkbox
											label="Volunteer"
											checked={jobType.V}
											onChange={() => handleCheckboxChange("V")}
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
							<details className="dropdown dropdown-bottom dropdown-end flex items-center">
								<summary
									tabIndex={0}
									className={`flex justify-center items-center gap-1 w-40 h-9 box-border rounded-full px-3 py-1 cursor-pointer font-semibold ${
										locationType.OS || locationType.R || locationType.H
											? "bg-green-600 text-white"
											: "border hover:border-2 border-base-300 hover:bg-base-200 duration-150"
									}`}
								>
									On-site/remote <BsCaretDownFill />
								</summary>
								<ul
									tabIndex={0}
									className="dropdown-content menu rounded-lg shadow bg-base-100 w-52 border border-base-300"
								>
									<div className="px-2">
										<Checkbox
											label="On-site"
											checked={locationType.OS}
											onChange={() => handleCheckboxChange("OS")}
										/>
										<Checkbox
											label="Remote"
											checked={locationType.R}
											onChange={() => handleCheckboxChange("R")}
										/>
										<Checkbox
											label="Hybrid"
											checked={locationType.H}
											onChange={() => handleCheckboxChange("H")}
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
														job._id === selectedJob._id && "bg-base-200"
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
										<div className="px-5 py-10 font-semibold">
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
