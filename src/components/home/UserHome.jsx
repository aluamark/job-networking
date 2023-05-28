import React from "react";
import Link from "next/link";

const UserHome = () => {
	return (
		<div className="hero min-h-screen bg-base-200">
			<div className="hero-content text-center">
				<div className="md:w-[600px]">
					<p className="py-6">You are already logged in.</p>
					<Link href={"/jobs"}>
						<button className="btn btn-sm md:btn-md btn-success gap-2 normal-case lg:gap-3">
							<div className="flex flex-col items-end">
								<span>Go to Jobs</span>
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
};

export default UserHome;
