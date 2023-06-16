import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSearchQuery } from "@/lib/react-query-hooks/useSearchQuery";
import People from "@/components/widgets/People";
import Pages from "@/components/widgets/Pages";
import { RiBriefcase4Line } from "react-icons/ri";
import Loading from "@/components/widgets/Loading";

const AllResults = () => {
	const router = useRouter();
	const { keywords } = router.query;
	const search = useSearchQuery(encodeURIComponent(keywords));

	const [jobs, setJobs] = useState([]);

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
			setJobs(
				uniqueJobs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
			);
		}
	}, [search.data]);

	if (search.isLoading) return <Loading />;

	if (search.data)
		return (
			<div className="max-w-screen-xl flex flex-col md:flex-row gap-5 mx-auto py-20 md:px-5">
				<Head>
					<title>&quot;{keywords}&quot; | Search | EmployX</title>
				</Head>
				<div className="flex flex-col flex-none w-full md:w-[225px]">
					<div className="md:fixed md:w-[225px] flex flex-col gap-3 bg-base-100 border border-base-300 rounded-lg p-5 font-semibold text-sm">
						<span className="text-xs text-zinc-500">On this page</span>
						{!Object.values(search.data).every((arr) => arr.length === 0) && (
							<ul className="flex flex-col gap-3">
								{search.data.companies.length !== 0 && (
									<li href="/">Companies</li>
								)}
								{search.data.jobsByCompany.length !== 0 && (
									<li>Jobs by companies</li>
								)}
								{search.data.people.length !== 0 && <li>People</li>}
								{search.data.jobsByTitle.length !== 0 && <li>Jobs by title</li>}
								{search.data.jobsBySkills.length !== 0 && (
									<li>Jobs by skills</li>
								)}
							</ul>
						)}
					</div>
				</div>
				<div className="flex flex-col lg:flex-row gap-5 w-full">
					<div className="flex flex-col gap-3 w-full">
						{Object.values(search.data).every((arr) => arr.length === 0) && (
							<div className="bg-base-100 border border-base-300 rounded-lg p-5">
								<span className="font-semibold">No results found.</span>
							</div>
						)}

						{search.data.companies.length === 1 && (
							<Link
								href={`/company/${search.data.companies[0].uniqueAddress}`}
								className="flex items-center gap-5 bg-base-100 border border-base-300 rounded-lg p-5"
							>
								<Image
									src={
										search.data.companies[0].picturePath
											? search.data.companies[0].picturePath
											: "/company.png"
									}
									width={88}
									height={88}
									alt={search.data.companies[0].name}
								/>
								<div className="flex flex-col">
									<span className="text-xl font-semibold">
										{search.data.companies[0].name}
									</span>
									<span className="text-sm">
										{search.data.companies[0].industry}
									</span>
									<span className="text-sm text-zinc-500">
										{search.data.companies[0].city &&
										search.data.companies[0].country
											? `${search.data.companies[0].city}, ${search.data.companies[0].country}`
											: search.data.companies[0].country
											? search.data.companies[0].country
											: null}
									</span>
								</div>
							</Link>
						)}

						{search.data.companies.length > 1 && (
							<div className="bg-base-100 border border-base-300 rounded-lg p-5">
								<span className="font-semibold">Companies</span>
								<div className="flex flex-col divide-y divide-base-300">
									{search.data.companies.map((company) => (
										<Link
											href={`/company/${company.uniqueAddress}`}
											className="flex gap-3 py-3"
											key={company._id}
										>
											<Image
												src={
													company.picturePath
														? company.picturePath
														: "/company.png"
												}
												alt={company.name}
												width={48}
												height={48}
												className="w-[48px] h-[48px] object-cover"
											/>
											<div className="flex flex-col">
												<span className="link link-hover font-semibold">
													{company.name}
												</span>
												<span className="text-sm">{company.industry}</span>
												<span className="text-sm text-zinc-500">
													{company.city && company.country
														? `${company.city}, ${company.country}`
														: company.country
														? company.country
														: null}
												</span>
												<span className="flex items-center gap-1.5 text-xs font-semibold pt-2.5">
													<RiBriefcase4Line className="w-4 h-4" />
													{company.jobs.length}{" "}
													{company.jobs.length > 1 ? "jobs" : "job"}
												</span>
											</div>
										</Link>
									))}
								</div>
							</div>
						)}

						{search.data.jobsByCompany.length !== 0 && (
							<div className="flex flex-col gap-3">
								{Object.values(
									search.data.jobsByCompany.reduce((groups, job) => {
										const company = job.company;
										if (!groups[company._id]) {
											groups[company._id] = {
												company,
												jobs: [],
											};
										}
										groups[company._id].jobs.push(job);
										return groups;
									}, {})
								).map((group) => (
									<div
										className={`bg-base-100 border border-base-300 rounded-lg ${
											group.jobs.length > 3 ? "pt-5" : "py-5"
										}`}
										key={group.company._id}
									>
										<span className="font-semibold px-5">
											Jobs from {group.company.name}
										</span>
										<div className="flex flex-col divide-y pt-2.5 px-5">
											{group.jobs
												.reverse()
												.slice(0, 3)
												.map((job) => (
													<Link
														href={{
															pathname: `/jobs/company/${group.company._id}`,
															query: {
																companyName: group.company.name,
																currentJobId: job._id,
															},
														}}
														className="flex gap-3 py-3"
														key={job._id}
													>
														<Image
															src={
																job.company.picturePath
																	? job.company.picturePath
																	: "/company.png"
															}
															alt={job.company.name}
															width={48}
															height={48}
															className="w-[48px] h-[48px] object-cover"
														/>
														<div className="flex flex-col">
															<span className="link link-hover font-semibold">
																{job.title}
															</span>

															<span className="text-sm">
																{job.company.name}
															</span>
															<span className="text-sm text-zinc-500">
																{job.city && job.country
																	? `${job.city}, ${job.country}`
																	: job.country
																	? job.country
																	: null}
															</span>
														</div>
													</Link>
												))}
										</div>
										{group.jobs.length > 3 && (
											<Link
												href={{
													pathname: `/jobs/company/${group.company._id}`,
													query: {
														companyName: group.company.name,
														currentJobId: group.jobs[0]._id,
													},
												}}
											>
												<div className="border-t py-3 text-center">
													<span className="text-sm text-zinc-500 font-semibold">
														Show all {group.jobs.length} jobs from{" "}
														{group.company.name}
													</span>
												</div>
											</Link>
										)}
									</div>
								))}
							</div>
						)}

						{search.data.people.length !== 0 && (
							<div className="bg-base-100 border border-base-300 rounded-lg p-5">
								<span className="font-semibold">People</span>
								<div className="flex flex-col divide-y divide-base-300">
									{search.data.people.map((person) => (
										<div className="flex gap-3 py-3" key={person._id}>
											<Link href={`/ex/${person.email}`} className="flex-none">
												<Image
													src={
														person.picturePath
															? person.picturePath
															: "/default.png"
													}
													alt={person.name}
													width={48}
													height={48}
													className="rounded-full w-[48px] h-[48px] object-cover"
												/>
											</Link>

											<Link href={`/ex/${person.email}`}>
												<div className="flex flex-col">
													<span className="link link-hover font-semibold">
														{person.firstName} {person.lastName}
													</span>

													<span className="text-sm">{person.headline}</span>
													<span className="text-sm text-zinc-500">
														{person.city && person.country
															? `${person.city}, ${person.country}`
															: person.country
															? person.country
															: null}
													</span>
												</div>
											</Link>
										</div>
									))}
								</div>
							</div>
						)}

						{jobs.length !== 0 && (
							<div className="bg-base-100 border border-base-300 rounded-lg">
								<div className="font-semibold px-5 pt-5">
									Jobs by title and skills
								</div>
								<div className="flex flex-col divide-y divide-base-300 px-5">
									{jobs
										.slice()
										.reverse()
										.slice(0, 3)
										.map((job) => (
											<Link
												href={`/jobs/search?keywords=${keywords}&currentJobId=${job._id}`}
												className="flex gap-3 py-3"
												key={job._id}
											>
												<Image
													src={
														job.company.picturePath
															? job.company.picturePath
															: "/company.png"
													}
													alt={job.company.name}
													width={48}
													height={48}
													className="w-[48px] h-[48px] object-cover"
												/>
												<div className="flex flex-col">
													<span className="link link-hover font-semibold">
														{job.title}
													</span>

													<span className="text-sm">{job.company.name}</span>
													<span className="text-sm text-zinc-500">
														{job.city && job.country
															? `${job.city}, ${job.country}`
															: job.country
															? job.country
															: null}
													</span>
												</div>
											</Link>
										))}
								</div>
								{jobs.length > 3 && (
									<Link
										href={`/jobs/search?keywords=${keywords}&currentJobId=${
											jobs[jobs.length - 1]._id
										}`}
									>
										<div className="border-t py-3 text-center">
											<span className="text-sm text-zinc-500 font-semibold">
												Show all {jobs.length} jobs
											</span>
										</div>
									</Link>
								)}
							</div>
						)}
					</div>
					<div>
						<div className="flex flex-col gap-3 w-full lg:w-[300px]">
							<People />
							<Pages />
						</div>
					</div>
				</div>
			</div>
		);
};

export default AllResults;
