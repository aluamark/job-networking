import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";
import { useRandomUsersQuery } from "@/lib/react-query-hooks/useRandomUsersQuery";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import People from "@/components/widgets/People";
import Loading from "@/components/widgets/Loading";
import AppliedJob from "@/components/job/AppliedJob";

const AppliedJobs = () => {
	const user = useLoggedUserQuery();
	const randomUsers = useRandomUsersQuery();

	if (user.isLoading) return <Loading />;

	if (user.data)
		return (
			<div className="max-w-screen-xl flex flex-col md:flex-row gap-5 mx-auto py-20 md:px-5">
				<Head>
					<title>Applied Jobs | EmployX</title>
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
									className="flex justify-between items-center gap-3 p-3 border-l-8 text-blue-600 border-blue-600"
								>
									<span>Applied jobs</span>
									<span>{user.data.jobApplications.length}</span>
								</Link>
							</div>

							<div>
								<Link
									href="/my-items/posted-jobs"
									className="flex justify-between items-center gap-3 p-3"
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
							<span className="font-semibold">Applied</span>
							{user.data.jobApplications &&
							user.data.jobApplications.length === 0 ? (
								<div className="pt-3">
									<span>No saved jobs.</span>
								</div>
							) : (
								<div className="flex flex-col divide-y divide-base-300 pt-3">
									{user.data.jobApplications &&
										user.data.jobApplications
											.slice()
											.reverse()
											.map((application) => (
												<AppliedJob
													key={application._id}
													application={application}
												/>
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

export default AppliedJobs;
