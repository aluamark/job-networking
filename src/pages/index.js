import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
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
			<div className="bg-base-100">
				<div className="min-h-screen flex flex-col justify-center items-center gap-10 px-5 py-28 md:w-[600px] mx-auto">
					<div className="flex flex-col gap-10">
						<h1 className="text-4xl md:text-5xl font-bold">
							Employ<span className="text-blue-600">X</span>
						</h1>
						<p className="text-xl">
							Unlock endless career opportunities with our innovative job
							posting website. Whether you&apos;re looking for your dream job or
							trying to find the perfect candidate, our platform has everything
							you need to succeed.
						</p>
						<p>
							Find your dream job or the perfect candidate with our innovative
							job posting website. Join now!
						</p>
						<div className="flex justify-between items-center">
							<Link href="/jobs" className="btn btn-outline">
								Explore jobs
							</Link>
							<div className="flex justify-end gap-3 items-center w-full bg-gradient-to-l from-blue-600 rounded-r-lg">
								<Link href="/signup" className="link link-hover text-white">
									Sign up
								</Link>
								<button onClick={() => signIn()} className="btn">
									Login
								</button>
							</div>
						</div>
					</div>
					<Footer />
				</div>
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
