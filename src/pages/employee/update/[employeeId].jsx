import React from "react";
import Head from "next/head";
import Link from "next/link";
import UpdateEmployeeForm from "@/components/form/UpdateEmployeeForm";

const Edit = () => {
	return (
		<div className="pt-24 px-5 max-w-screen-xl mx-auto">
			<Head>
				<title>Update Employee</title>
			</Head>
			<Link href="/dashboard">
				<button className="btn btn-md btn-ghost gap-2 normal-case lg:gap-3 mb-5">
					<svg
						className="h-6 w-6 fill-current md:h-8 md:w-8"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
					</svg>
					<div className="flex flex-col items-start">
						<p className="text-base-content/50 text-xs font-normal">Prev</p>
						<p className="">Dashboard</p>
					</div>
				</button>
			</Link>
			<UpdateEmployeeForm />
		</div>
	);
};

export default Edit;
