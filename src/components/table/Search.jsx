import React from "react";

const Search = ({ searchValue, setSearchValue }) => {
	return (
		<div className="relative w-full">
			<label htmlFor="search" className="sr-only">
				Search
			</label>
			<div className="rounded-md shadow-sm w-1/2">
				<div
					className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
					aria-hidden="true"
				>
					<svg
						className="h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						x="0px"
						y="0px"
						width="30"
						height="30"
						viewBox="0 0 30 30"
					>
						<path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971  23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
					</svg>
				</div>
				<input
					className="input input-md border w-full rounded-md pl-10 text-sm"
					type="text"
					placeholder="Search by name..."
					spellCheck="false"
					autoComplete="off"
					name="search"
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
				/>
			</div>
		</div>
	);
};

export default Search;
