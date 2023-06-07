import { useSession } from "next-auth/react";
import GuestHome from "@/components/home/GuestHome";
import { useRouter } from "next/router";
import Loading from "@/components/widgets/Loading";

export default function Home() {
	const router = useRouter();
	const { status } = useSession();

	if (status === "loading") {
		return <Loading />;
	}

	if (status === "unauthenticated") {
		return <GuestHome />;
	}

	if (status === "authenticated") {
		router.push("/jobs");
	}
}

// export const getServerSideProps = async () => {
// 	const employees = await getEmployees();

// 	return {
// 		props: {
// 			employees,
// 		},
// 	};
// };
