import React from "react";
import Link from "next/link";
import Modal from "react-modal";
import { FiEdit2 } from "react-icons/fi";
import { MdClose } from "react-icons/md";

Modal.setAppElement("#root");

const ContactInfoModal = ({ user, ownProfile, isOpen, setIsOpen }) => {
	const fullName = user?.firstName + " " + user?.lastName;

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
			<div className="bg-base-100 rounded-lg w-[550px]">
				<div className="flex justify-between items-center py-3 pl-7 pr-3">
					<h3 className="text-lg font-semibold">{fullName}</h3>
					<button
						onClick={closeModal}
						className="rounded-full hover:bg-base-300 cursor-pointer"
					>
						<MdClose className="w-7 h-7 m-1" />
					</button>
				</div>

				<div className="border-t border-base-300 pl-7 pb-7 pr-3">
					<div className="flex justify-between items-center py-3">
						<h3 className="text-lg font-semibold">Contact Info</h3>
						{ownProfile && (
							<button className="rounded-full hover:bg-base-300">
								<FiEdit2 className="w-6 h-6 m-2" />
							</button>
						)}
					</div>
					<div className="flex flex-col gap-4">
						<div>
							<h2 className="font-bold">
								{ownProfile ? "Your Profile" : `${fullName}'s Profile`}
							</h2>
							<Link href="/gh/aluamark@gmail.com">
								<span className="link link-hover text-blue-600 text-sm font-semibold">
									{`gethired.com/gh/${user.email}`}
								</span>
							</Link>
						</div>
						<div>
							<h2 className="font-bold">Phone</h2>
							<span className="text-sm">+639363411848</span>{" "}
							<span className="text-zinc-500 text-sm">(Work)</span>
						</div>
						<div>
							<h2 className="font-bold">Address</h2>
							<span className="link link-hover text-blue-600 text-sm font-semibold">
								Antipolo, Rizal
							</span>
						</div>
						<div>
							<h2 className="font-bold">Email</h2>

							<a
								href={`mailto:aluamark@gmail.com`}
								className="link link-hover text-blue-600 text-sm font-semibold"
							>
								aluamark@gmail.com
							</a>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ContactInfoModal;
