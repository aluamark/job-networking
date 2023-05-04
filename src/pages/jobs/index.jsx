import React from "react";
import Head from "next/head";

const index = () => {
	return (
		<div className="max-w-screen-xl mx-auto pt-24 px-5 bg-red-500">
			<Head>
				<title>Jobs | GetHired</title>
			</Head>
			<div>
				<h1 className="text-xl">Jobs</h1>
			</div>
		</div>
	);
};

export default index;
