import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { PuffLoader } from "react-spinners";
import OwnProfile from "@/components/profile/OwnProfile";
import ViewProfile from "@/components/profile/ViewProfile";

const Profile = () => {
	const router = useRouter();
	const { email } = router.query;
	const { data, status } = useSession();

	if (status === "loading") {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<PuffLoader />
			</div>
		);
	}

	if (status === "authenticated" && data.user.email === email) {
		return <OwnProfile />;
	}

	return <ViewProfile />;
};

export default Profile;
