import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import GuestHome from "@/components/home/GuestHome";
import UserHome from "@/components/home/UserHome";
import { PuffLoader } from "react-spinners";

export default function Home() {
	const { status } = useSession();

	if (status === "loading") {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<PuffLoader />
			</div>
		);
	}

	if (status === "unauthenticated") {
		return <GuestHome />;
	}

	return <UserHome />;
}

// export const getServerSideProps = async () => {
// 	const employees = await getEmployees();

// 	return {
// 		props: {
// 			employees,
// 		},
// 	};
// };
