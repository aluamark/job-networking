import React from "react";
import { useSession } from "next-auth/react";
import { PuffLoader } from "react-spinners";
import GuestJobs from "@/components/jobs/GuestJobs";
import UserJobs from "@/components/jobs/UserJobs";

const Jobs = () => {
	const { status } = useSession();

	if (status === "loading")
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-10">
				<span className="text-5xl font-extrabold text-blue-600">GetHired</span>
				<PuffLoader />
			</div>
		);

	if (status === "unauthenticated") return <GuestJobs />;

	if (status === "authenticated") return <UserJobs />;
};

export default Jobs;
