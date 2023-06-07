import React, { useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { BarLoader } from "react-spinners";

// Resume PDF renderer
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

Modal.setAppElement("#root");

const ResumeViewModal = ({ isOpen, setIsOpen, resume }) => {
	const [numPages, setNumPages] = useState(null);
	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			overlayClassName="fixed inset-0 bg-black/75"
			className="min-h-screen h-screen flex justify-center items-center"
		>
			<div className="bg-base-100 rounded-lg w-full md:w-[585px] h-[80%]">
				<div className="flex flex-col h-full">
					<div className="flex justify-between items-center py-3 pl-5 pr-3">
						<h3 className="text-lg font-semibold">Submmited Resume</h3>
						<button
							onClick={closeModal}
							className="rounded-full hover:bg-base-300 cursor-pointer"
						>
							<MdClose className="w-7 h-7 m-1" />
						</button>
					</div>

					<div className="overflow-x-auto">
						<Document
							file={resume}
							onLoadSuccess={onDocumentLoadSuccess}
							loading={
								<div className="p-5">
									<BarLoader />
								</div>
							}
							className="pb-5"
						>
							{Array.from(new Array(numPages), (el, index) => (
								<Page
									className="rounded-lg"
									scale={0.95}
									key={index + 1}
									pageNumber={index + 1}
								/>
							))}
						</Document>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ResumeViewModal;
