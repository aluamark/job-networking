import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { FaSearch } from "react-icons/fa";
import { useSearchQuery } from "@/lib/react-query-hooks/useSearchQuery";
import { PuffLoader } from "react-spinners";

const SearchFilter = ({ searchHistory }) => {
	const router = useRouter();
	const [keywords, setKeywords] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const divRef = useRef(null);

	const debouncedKeywords = useDebounce(keywords, 500);
	const search = useSearchQuery(encodeURIComponent(debouncedKeywords));

	const [uniqueSkills, setUniqueSkills] = useState([]);

	useEffect(() => {
		const skillsSet = new Set();

		if (search?.data?.jobsBySkills?.length !== 0) {
			search?.data?.jobsBySkills.forEach((job) => {
				job.skills
					.filter((skill) =>
						skill.toLowerCase().startsWith(debouncedKeywords.toLowerCase())
					)
					.forEach((skill) => {
						skillsSet.add(skill);
					});
			});

			setUniqueSkills(Array.from(skillsSet));
		}
	}, [search?.data?.jobsBySkills, debouncedKeywords]);

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleDivBlur = () => {
		setIsFocused(false);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (divRef.current && !divRef.current.contains(event.target)) {
				setIsFocused(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleInputChange = (event) => {
		setKeywords(event.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (keywords) {
			router.push(`/jobs/search?keywords=${keywords}`);
		}
	};

	return (
		<div className="relative w-full">
			<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
				<FaSearch />
			</div>
			<form onSubmit={handleSubmit} ref={divRef}>
				<input
					type="text"
					name="keywords"
					className="bg-base-200 hover:bg-base-300 focus:outline-none rounded pl-8 pr-2.5 py-2.5 w-full duration-300"
					placeholder="Search by title, skill, or company"
					value={keywords}
					onChange={handleInputChange}
					onClick={handleFocus}
					autoComplete="off"
				/>
				{isFocused && (
					<div
						onBlur={handleDivBlur}
						className="absolute top-11 bg-base-100 w-full border border-base-300 rounded-lg py-1"
					>
						{searchHistory?.length !== 0 && (
							<div>
								{searchHistory?.map((keyword) => (
									<div key={keyword}>{keyword}</div>
								))}
							</div>
						)}
						{keywords && debouncedKeywords ? (
							<>
								{keywords && debouncedKeywords && search.isLoading ? (
									<div className="p-5">
										<PuffLoader size={20} />
									</div>
								) : search.data ? (
									!Object.values(search.data).every(
										(arr) => arr.length === 0
									) ? (
										<div className="flex flex-col">
											{search.data.companies.length !== 0 &&
												search.data.companies.slice(0, 3).map((company) => (
													<Link
														onClick={() => setIsFocused(false)}
														href={`/company/${company.uniqueAddress}`}
														key={company._id}
														className="flex items-center hover:bg-base-300 px-5 py-1.5"
													>
														{company.name}{" "}
														<Image
															src={
																company.picturePath
																	? company.picturePath
																	: "/company.png"
															}
															width={32}
															height={32}
															alt={company.name}
															className="ml-auto"
														/>
													</Link>
												))}
											{search.data.people.length !== 0 &&
												search.data.people.slice(0, 3).map((user) => (
													<Link
														onClick={() => setIsFocused(false)}
														href={`/ex/${user.email}`}
														key={user._id}
														className="flex items-center hover:bg-base-300 px-5 py-1.5"
													>
														{user.firstName} {user.lastName}
														<Image
															src={
																user.picturePath
																	? user.picturePath
																	: "/default.png"
															}
															width={32}
															height={32}
															alt={`${user.firstName} ${user.lastName}`}
															className="ml-auto border border-base-300 rounded-full"
														/>
													</Link>
												))}
											{search.data.jobsByTitle.length !== 0 &&
												search.data.jobsByTitle.slice(0, 3).map((job) => (
													<Link
														onClick={() => setIsFocused(false)}
														href={`/search/results/all?keywords=${job.title}`}
														key={job._id}
														className="flex justify-between items-center gap-2.5 hover:bg-base-300 px-5 py-1"
													>
														<div>
															{job.title} ·{" "}
															<span className="text-xs text-zinc-500">
																{job.company.name}
															</span>
														</div>
														<Image
															src={
																job.company.picturePath
																	? job.company.picturePath
																	: "/company.png"
															}
															width={30}
															height={30}
															alt={job.company.name}
														/>
													</Link>
												))}
											{uniqueSkills.slice(0, 3).map((skill) => (
												<Link
													onClick={() => setIsFocused(false)}
													href={`/search/results/all?keywords=${skill}`}
													key={skill}
													className="flex items-center gap-1 hover:bg-base-300 px-5 py-1.5"
												>
													{skill}
													<span className="text-xs text-zinc-500">in Jobs</span>
												</Link>
											))}
										</div>
									) : (
										keywords &&
										debouncedKeywords && (
											<div className="p-5">No results found</div>
										)
									)
								) : (
									<div className="p-5">Try searching for your desired job</div>
								)}
							</>
						) : (
							<div className="p-5">Try searching for your desired job</div>
						)}
					</div>
				)}
			</form>
		</div>
	);
};

export default SearchFilter;
