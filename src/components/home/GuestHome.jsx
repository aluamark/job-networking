import React from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const GuestHome = () => {
	return (
		<div className="hero min-h-screen bg-base-200">
			<div className="hero-content text-center">
				<div className="md:w-[600px] flex flex-col gap-5">
					<h1 className="text-4xl md:text-5xl font-bold">Get Hired</h1>
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
};

export default GuestHome;
