import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsChevronCompactRight, BsChevronCompactLeft } from "react-icons/bs";
import JobTimeDifference from "@/components/job/JobTimeDifference";

const Jobs = ({ companyId, companyName, companyPicture, jobs }) => {
	const carouselRef = useRef(null);
	const [isScrollStart, setIsScrollStart] = useState(true);
	const [isScrollEnd, setIsScrollEnd] = useState(false);
	const reversedJobs = jobs.slice().reverse();

	const scrollToLeft = () => {
		carouselRef.current.scrollBy({
			top: 0,
			left: -carouselRef.current.offsetWidth,
			behavior: "smooth",
		});
	};

	const scrollToRight = () => {
		carouselRef.current.scrollBy({
			top: 0,
			left: carouselRef.current.offsetWidth,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		const container = carouselRef.current;
		const handleScroll = () => {
			const currentPosition = container.scrollLeft;
			setIsScrollStart(currentPosition === 0);
			setIsScrollEnd(
				currentPosition + container.clientWidth === container.scrollWidth
			);
		};

		container.addEventListener("scroll", handleScroll);
		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className="bg-base-100 rounded-lg border border-base-300">
			<div className="flex justify-between items-center p-5">
				<span className="text-lg">
					{jobs.length !== 0 ? "Recently posted jobs" : "No available job"}
				</span>
				{jobs.length > 2 && (
					<div className="flex font-semibold text-sm">
						<button
							onClick={scrollToLeft}
							disabled={isScrollStart}
							className={`flex items-center gap-1.5 duration-300 rounded px-3 py-1 ${
								isScrollStart
									? "cursor-not-allowed hover:bg-base-100 text-zinc-300"
									: "hover:bg-base-300 text-zinc-500"
							}`}
						>
							<BsChevronCompactLeft className="stroke-2" />
							Previous
						</button>
						<button
							onClick={scrollToRight}
							disabled={isScrollEnd}
							className={`flex items-center gap-1.5 duration-300 rounded px-3 py-1 ${
								isScrollEnd
									? "cursor-not-allowed hover:bg-base-100 text-zinc-300"
									: "hover:bg-base-300 text-zinc-500"
							}`}
						>
							Next
							<BsChevronCompactRight className="stroke-2" />
						</button>
					</div>
				)}
			</div>
			<div
				ref={carouselRef}
				className={`flex gap-3 px-5 w-full overflow-x-hidden ${
					jobs.length <= 4 && jobs.length !== 0 && "pb-5"
				}`}
			>
				{reversedJobs.map((job) => (
					<Link
						href={{
							pathname: `/jobs/company/${companyId}`,
							query: {
								companyName: encodeURIComponent(companyName),
								currentJobId: job._id,
							},
						}}
						key={job._id}
						className="flex flex-col flex-none gap-5 w-1/2 md:w-1/3 justify-between border border-base-300 rounded-lg p-5 hover:shadow-lg cursor-pointer"
					>
						<div className="flex flex-col">
							<Image
								src={companyPicture ? companyPicture : "/company.png"}
								width={72}
								height={72}
								alt="company-picture"
								className="pb-3"
							/>
							<span className="font-semibold">{job.title}</span>
							<span className="text-sm">{companyName}</span>
							<span className="text-zinc-500 text-sm">
								{job.city}, {job.country}
							</span>
						</div>
						<span className="text-green-600 text-xs font-semibold">
							<JobTimeDifference date={job.createdAt} />
						</span>
					</Link>
				))}
			</div>
		</div>
	);
};

export default Jobs;
