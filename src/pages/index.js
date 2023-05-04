import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
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
		return (
			<div className="hero min-h-screen bg-base-200">
				<div className="hero-content text-center">
					<div className="md:w-[600px] flex flex-col gap-5">
						<h1 className="text-4xl md:text-5xl font-bold">Get Hired</h1>
						<p>
							Unlock endless career opportunities with our innovative job
							posting website. Whether you&apos;re looking for your dream job or
							trying to find the perfect candidate, our platform has everything
							you need to succeed.
						</p>
						<p>
							Find your dream job or the perfect candidate with our innovative
							job posting website. Join now!
						</p>
						<div className="flex justify-center items-center gap-5">
							<Link href="/signup">
								<button className="link link-hover">Register</button>
							</Link>
							<button onClick={() => signIn()} className="btn">
								Login
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="hero min-h-screen bg-base-200">
			<div className="hero-content text-center">
				<div className="md:w-[600px]">
					<p className="py-6">You are already logged in.</p>
					<Link href={"/dashboard"}>
						<button className="btn btn-sm md:btn-md btn-success gap-2 normal-case lg:gap-3">
							<div className="flex flex-col items-end">
								<span>Go to Dashboard</span>
							</div>
							<svg
								className="h-6 w-6 fill-current md:h-8 md:w-8"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
							>
								<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
							</svg>
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}

// export const getServerSideProps = async () => {
// 	const employees = await getEmployees();

// 	return {
// 		props: {
// 			employees,
// 		},
// 	};
// };
