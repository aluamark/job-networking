import React, { useState } from "react";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import JobTimeDifference from "./JobTimeDifference";

// Resume PDF renderer
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

const ApplicationView = ({ selectedApplication }) => {
	const [numPages, setNumPages] = useState(null);
	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};

	return (
		<div className="flex flex-col gap-3 w-full h-full pt-5 bg-base-100 overflow-y-auto">
			<div className="flex flex-col px-5">
				<span className="text-xl font-semibold">
					{selectedApplication.applicant.firstName}{" "}
					{selectedApplication.applicant.lastName}&apos;s application
				</span>
				<span className="text-sm">
					{selectedApplication.applicant?.headline}
				</span>
				<span className="text-sm text-zinc-500">
					{selectedApplication.applicant.city &&
					selectedApplication.applicant.country
						? `${selectedApplication.applicant.city}, ${selectedApplication.applicant.country}`
						: selectedApplication.applicant.country
						? `${selectedApplication.applicant.country}`
						: null}
				</span>
			</div>
			<div className="flex px-5">
				<Link
					href={`/ex/${selectedApplication.applicant.email}`}
					className="border-blue-600 hover:bg-blue-50 border-2 text-blue-600 px-5 py-1 rounded-full font-semibold"
				>
					View profile
				</Link>
			</div>
			<div className="text-sm px-5">
				{/* <div>
					Status:{" "}
					<span className="text-green-600 font-semibold">
						{selectedApplication.status}
					</span>
				</div> */}
				<span className="font-semibold text-xs text-zinc-500">
					Applied <JobTimeDifference date={selectedApplication.createdAt} />
				</span>
			</div>
			<div className="flex flex-col px-5 text-sm">
				<span>Email: {selectedApplication.email}</span>
				<span>Phone: {selectedApplication.phone}</span>
			</div>

			<div className="px-5">
				<span className="font-semibold">Uploaded resume</span>
			</div>
			<div className="overflow-x-auto">
				<Document
					file={selectedApplication.resume}
					onLoadSuccess={onDocumentLoadSuccess}
					loading={
						<div className="px-5 pt-5">
							<BarLoader />
						</div>
					}
				>
					{Array.from(new Array(numPages), (el, index) => (
						<Page scale={0.95} key={index + 1} pageNumber={index + 1} />
					))}
				</Document>
			</div>
		</div>
	);
};

export default ApplicationView;
