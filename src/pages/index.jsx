import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import SearchFilter from "@/components/navbar/SearchFilter";
import Loading from "@/components/widgets/Loading";
import Footer from "@/components/footer/Footer";

export default function Home() {
	const router = useRouter();
	const { status } = useSession();

	if (status === "loading") {
		return <Loading />;
	}

	if (status === "unauthenticated") {
		return (
			<div className="min-h-screen max-w-screen-sm mx-auto w-full flex flex-col md:justify-center md:items-center px-5 py-5">
				<div className="flex flex-col gap-5 md:gap-10 pt-10">
					<h1 className="text-4xl md:text-5xl font-bold">
						Employ<span className="text-blue-600">X</span>
					</h1>
					<div className="flex flex-col gap-3">
						<h2 className="text-xl font-semibold">Explore jobs</h2>
						<SearchFilter />
					</div>

					<p>
						Unlock endless career opportunities with our innovative job posting
						website. Whether you&apos;re looking for your dream job or trying to
						find the perfect candidate, our platform has everything you need to
						succeed.
					</p>
					<p>
						Find your dream job or the perfect candidate with our innovative job
						posting website. Join now!
					</p>
					<div className="flex justify-end gap-3 items-center w-full bg-gradient-to-l from-blue-600 rounded-r-lg">
						<Link href="/signup" className="link link-hover text-white">
							Sign up
						</Link>
						<button onClick={() => signIn()} className="btn">
							Login
						</button>
					</div>
				</div>
				<Footer />
			</div>
		);
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
