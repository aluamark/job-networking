import React from "react";
import Head from "next/head";
import Image from "next/image";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";

Modal.setAppElement("#root");

const PreviewModal = ({ formData, isOpen, setIsOpen, renderDescription }) => {
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
			<Head>
				<title>Job Preview | EmployX</title>
			</Head>
			<div className="flex flex-col bg-base-100 w-[550px] h-[80%]">
				<div className="flex justify-between items-center py-3 pl-5 pr-3">
					<div>
						<h3 className="font-semibold">Job Preview</h3>
						<p className="text-xs">
							This is a preview of what your job post will look like to job
							seekers. Any screening questions will appear after candidates
							click Apply.
						</p>
					</div>

					<button
						onClick={closeModal}
						className="rounded-full hover:bg-base-300 cursor-pointer"
					>
						<MdClose className="w-7 h-7 m-1" />
					</button>
				</div>

				<div className="flex flex-col border-y border-base-300 h-full overflow-y-auto">
					<div className="flex flex-col gap-3 w-full">
						<div className="relative">
							<div>
								<Image
									src="/banner.jpg"
									className="h-[96px] w-full object-cover"
									width={550}
									height={96}
									alt="banner"
								/>
							</div>
							<div className="absolute top-14 left-5 bg-base-100 p-1">
								<Image
									src={
										formData.companyPicturePath
											? formData.companyPicturePath
											: "/company.png"
									}
									width={60}
									height={60}
									alt="company-picture"
								/>
							</div>
						</div>

						<div className="flex flex-col pt-5 px-5">
							<span className="text-lg font-semibold">{formData.title}</span>

							<span className="text-sm">
								<span className="font-semibold">{formData.companyName}</span> ·{" "}
								{formData.locationType} · {formData.city}, {formData.country} ·{" "}
								{formData.employmentType}
							</span>
						</div>
						<div className="flex flex-col gap-3 px-5 pb-5">
							<span className="font-semibold">About the job</span>
							<div className="text-sm">{renderDescription()}</div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default PreviewModal;
