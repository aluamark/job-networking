import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useRandomCompaniesQuery } from "@/lib/react-query-hooks/useRandomCompaniesQuery";

const Pages = () => {
	const router = useRouter();
	const { email } = router.query;
	const { data: loggedUser } = useSession();
	const { data: randomCompanies } = useRandomCompaniesQuery();

	if (randomCompanies?.length === 0)
		return (
			<div className="flex flex-col gap-3 bg-base-100 border border-base-300 rounded-lg p-5">
				<h3 className="font-semibold">Pages you may like</h3>
				<p>No pages available at the moment.</p>
			</div>
		);

	if (randomCompanies?.length > 0)
		return (
			<div className="bg-base-100 border border-base-300 rounded-lg p-5">
				<h3 className="font-semibold">Pages you may like</h3>
				<div className="flex flex-col divide-y divide-base-300 text-sm">
					{randomCompanies.map((company) => {
						return (
							<Link
								href={`/company/${company.uniqueAddress}`}
								key={company._id}
							>
								<div className="flex gap-3 w-full py-3">
									<div className="flex-none">
										<Image
											src={
												company.picturePath
													? company.picturePath
													: "/company.png"
											}
											alt="company-logo"
											className="border border-base-300 w-12 h-12 object-cover"
											width={48}
											height={48}
										/>
									</div>
									<div>
										<div>
											<span className="font-semibold">{company.name}</span>
										</div>
										<div>
											<span className="text-zinc-500 text-xs">
												{company.industry}
											</span>
										</div>

										{/* <div className="pt-1">
											<button className="btn btn-outline btn-sm rounded-full">
												Connect
											</button>
										</div> */}
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		);
};

export default Pages;
