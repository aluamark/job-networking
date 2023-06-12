import React, { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "react-modal";
import { BsArrowLeftShort } from "react-icons/bs";
import { viewApplication, viewApplicationResume } from "@/lib/helper";
import { BarLoader } from "react-spinners";
import JobTimeDifference from "./JobTimeDifference";

// Resume PDF renderer
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

Modal.setAppElement("#root");

const ApplicationViewModal = ({ isOpen, setIsOpen, selectedApplication }) => {
	const [numPages, setNumPages] = useState(null);
	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	const [showResume, setShowResume] = useState(false);
	const handleShowResume = () => {
		setShowResume(true);

		if (
			selectedApplication.status === "viewed" ||
			selectedApplication.status === "pending"
		) {
			viewApplicationResume(selectedApplication._id);
		}
	};

	useEffect(() => {
		setShowResume(false);
	}, [selectedApplication]);

	useEffect(() => {
		if (selectedApplication && selectedApplication.status === "pending") {
			viewApplication(selectedApplication._id);
		}
	}, [selectedApplication, selectedApplication.status]);

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			overlayClassName="md:hidden fixed inset-0 bg-black/75"
			className="md:hidden min-h-screen h-screen flex justify-center items-center"
		>
			<div className="fixed top-0 left-0 flex w-full p-3 bg-base-100">
				<button onClick={closeModal} className="">
					<BsArrowLeftShort className="w-7 h-7" />
				</button>
			</div>
			<div className="flex flex-col gap-3 w-full h-full pt-14 bg-base-100 overflow-y-auto">
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
				<div className="flex flex-col px-5 text-sm">
					<span>Email: {selectedApplication.email}</span>
					<span>Phone: {selectedApplication.phone}</span>
					<span className="font-semibold text-xs text-zinc-500">
						Applied <JobTimeDifference date={selectedApplication.createdAt} />
					</span>
				</div>
				<div className="flex gap-1.5 px-5">
					<Link
						href={`/ex/${selectedApplication.applicant.email}`}
						className="border-blue-600 hover:bg-blue-50 border-2 text-blue-600 px-5 py-1 rounded-full font-semibold"
					>
						View profile
					</Link>
					<button
						onClick={handleShowResume}
						className="border-blue-600 hover:bg-blue-50 border-2 text-blue-600 px-5 py-1 rounded-full font-semibold"
					>
						View resume
					</button>
				</div>
				{showResume && (
					<>
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
					</>
				)}
			</div>
		</Modal>
	);
};

export default ApplicationViewModal;
