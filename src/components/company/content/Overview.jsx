import React, { useState } from "react";
import { BsArrowRightShort } from "react-icons/bs";
import Jobs from "./Jobs";

const About = ({ company, about, setTab }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const truncatedText = isExpanded ? about : about.slice(0, 300) + "...";
	const showButton = about.length > 100;

	return (
		<div className="flex flex-col gap-3">
			<div className="bg-base-100 border border-base-300 rounded-lg">
				<div className="flex items-center px-5 pt-5">
					<span className="text-lg font-semibold">About</span>
				</div>

				<div className="pt-2.5 pb-5 px-5">
					<p>
						{truncatedText}
						{showButton && (
							<button
								className="text-blue-600 ml-2 focus:outline-none"
								onClick={toggleExpand}
							>
								{isExpanded ? "See Less" : "See More"}
							</button>
						)}
					</p>
				</div>

				<div
					onClick={() => setTab(1)}
					className="flex justify-center items-center py-2.5 hover:bg-base-300 rounded-b border-t border-base-300 cursor-pointer text-sm font-semibold"
				>
					Show all details
					<BsArrowRightShort className="w-6 h-6" />
				</div>
			</div>

			<Jobs
				companyId={company._id}
				companyName={company.name}
				companyPicture={company.picturePath}
				jobs={company.jobs}
			/>
		</div>
	);
};

export default About;
