import React from "react";
import { useSession } from "next-auth/react";
import GuestJobs from "@/components/jobs/GuestJobs";
import UserJobs from "@/components/jobs/UserJobs";
import Loading from "@/components/widgets/Loading";

const Jobs = () => {
	const { status } = useSession();

	if (status === "loading") return <Loading />;

	if (status === "unauthenticated") return <GuestJobs />;

	if (status === "authenticated") return <UserJobs />;
};

export default Jobs;
