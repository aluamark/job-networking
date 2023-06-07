import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import OwnProfile from "@/components/profile/OwnProfile";
import ViewProfile from "@/components/profile/ViewProfile";
import Loading from "@/components/widgets/Loading";

const Profile = () => {
	const router = useRouter();
	const { email } = router.query;
	const { data, status } = useSession();

	if (status === "loading") {
		return <Loading />;
	}

	if (status === "authenticated" && data.user.email === email) {
		return <OwnProfile />;
	}

	return <ViewProfile />;
};

export default Profile;
