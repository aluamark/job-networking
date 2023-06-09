import React from "react";

const Overview = ({ company }) => {
	return (
		<div className="flex flex-col gap-2.5 p-5 bg-base-100 border border-base-300 rounded-lg">
			<span className="text-lg font-semibold">Overview</span>

			<div>
				<p className="text-zinc-500">{company.about}</p>
			</div>

			{company.website && (
				<div className="flex flex-col font-semibold">
					<span>Website</span>
					<span className="link link-hover text-blue-600">
						{company.website}
					</span>
				</div>
			)}

			{company.industry && (
				<div className="flex flex-col">
					<span className="font-semibold">Industry</span>
					<span className="text-zinc-500">{company.industry}</span>
				</div>
			)}

			{company.city && company.country && (
				<div className="flex flex-col">
					<span className="font-semibold">Headquarters</span>
					<span className="text-zinc-500">
						{company.city}, {company.country}
					</span>
				</div>
			)}

			{company.founded && (
				<div className="flex flex-col">
					<span className="font-semibold">Founded</span>
					<span className="text-zinc-500">{company.founded}</span>
				</div>
			)}

			{/* {company.industry && (
				<div className="flex flex-col">
					<span className="font-semibold">Specialties</span>
					<span className="text-zinc-500">{company.industry}</span>
				</div>
			)} */}
		</div>
	);
};

export default Overview;
