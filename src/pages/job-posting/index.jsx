import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";
import { PuffLoader } from "react-spinners";

const JobPosting = () => {
	const user = useLoggedUserQuery();
	const pages = user?.data?.adminPages;

	if (!pages)
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-10">
				<span className="text-5xl font-extrabold text-blue-600">GetHired</span>
				<PuffLoader />
			</div>
		);

	return (
		<div className="max-w-screen-sm mx-auto flex flex-col gap-5 pt-20 md:px-5 pb-5">
			<Head>
				<title>Job Posting | GetHired</title>
			</Head>
			{pages.length !== 0 && (
				<div className="flex flex-col gap-3 bg-base-100 border border-base-300 rounded-lg p-5">
					<h1 className="text-xl font-semibold">Manage pages</h1>

					{pages.map((page) => (
						<Link
							key={page.uniqueAddress}
							href={`/company/${page.uniqueAddress}`}
							className="btn btn-outline flex-1 justify-start gap-3 normal-case hover:bg-base-100 hover:text-base-content rounded-none p-1"
						>
							<Image
								src={page.picturePath ? page.picturePath : "/company.png"}
								alt={page.name}
								width={48}
								height={48}
							/>

							{page.name}
						</Link>
					))}
				</div>
			)}
			<Link
				href="/company/setup/new"
				className="btn flex-1 normal-case rounded-lg p-5 mx-5 md:mx-0"
			>
				Create a company page +
			</Link>
		</div>
	);
};

export default JobPosting;
