import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { FaSearch } from "react-icons/fa";

const Search = () => {
	const router = useRouter();
	const [keywords, setKeywords] = useState("");
	const debouncedSearchTerm = useDebounce(keywords, 500);

	useEffect(() => {
		if (debouncedSearchTerm) {
			router.push(`/search/results/all?keywords=${debouncedSearchTerm}`);
		}
	}, [debouncedSearchTerm]);

	const handleInputChange = (event) => {
		setKeywords(event.target.value);
	};

	return (
		<div className="relative w-full md:w-1/2">
			<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
				<FaSearch />
			</div>
			<input
				type="text"
				name="keywords"
				className="bg-slate-100 rounded pl-8 pr-2.5 py-2.5 w-56 focus:w-full duration-300"
				placeholder="Search by title, skill, or company"
				value={keywords}
				onChange={handleInputChange}
			/>
		</div>
	);
};

export default Search;
