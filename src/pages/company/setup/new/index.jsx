import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { validateUniqueAddress, createCompany } from "@/lib/helper";
import FormInput from "@/components/form/FormInput";
import { toast } from "react-toastify";
import { PuffLoader } from "react-spinners";
import { FaSpinner } from "react-icons/fa";

const NewCompany = () => {
	const router = useRouter();
	const { data, status } = useSession();
	const [formData, setFormData] = useState({
		name: "",
		uniqueAddress: "",
		industry: "",
		tagline: "",
		admins: [],
	});
	const [formErrors, setFormErrors] = useState({
		name: "",
		uniqueAddress: "",
		industry: "",
		tagline: "",
	});
	const [isChecked, setIsChecked] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);

	useEffect(() => {
		if (data && data.user) {
			setFormData({ ...formData, admins: [data.user._id] });
		}
	}, [data]);

	const handleChange = (event) => {
		const { name, value } = event.target;

		if (name === "name") {
			const address = value
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");

			setFormData({ ...formData, name: value, uniqueAddress: address });
			setFormErrors({ ...formErrors, name: "" });
			setFormErrors({ ...formErrors, uniqueAddress: "" });
		} else {
			setFormData({ ...formData, [name]: value });
			setFormErrors({ ...formErrors, [name]: "" });
		}
	};

	const handleSearch = async (searchValue) => {
		const specialChars = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;

		try {
			if (searchValue.trim() !== "" && !specialChars.test(searchValue.trim())) {
				await validateUniqueAddress(searchValue);
			}

			if (searchValue.trim() !== "" && specialChars.test(searchValue.trim())) {
				setFormErrors({
					...setFormErrors,
					uniqueAddress: "Invalid public URL",
				});
			}
		} catch (error) {
			if (error.response && error.response.status === 409) {
				setFormErrors({
					...setFormErrors,
					uniqueAddress: "This public URL is already in use.",
				});
			}
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			handleSearch(formData.uniqueAddress);
		}, 500);

		return () => clearTimeout(timer);
	}, [formData.uniqueAddress]);

	const handleCheckboxChange = (event) => {
		setIsChecked(event.target.checked);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitLoading(true);

		const errors = {};

		if (!formData.name) {
			errors.name = "Company name is a required field";
		}

		if (!formData.uniqueAddress) {
			errors.uniqueAddress = "Unique address is a required field";
		}

		if (Object.keys(errors).length === 0) {
			const { company } = await createCompany(formData);

			if (company) {
				toast.success(`Created company page for ${company.name}.`);
				router.push(`/company/${formData.uniqueAddress}`);
			} else {
				toast.error(res.error);
			}
		} else {
			setFormErrors(errors);
		}

		setSubmitLoading(false);
	};

	if (status === "loading") {
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-10">
				<span className="text-5xl font-extrabold text-blue-600">GetHired</span>
				<PuffLoader />
			</div>
		);
	}

	if (status === "unauthenticated") {
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-3">
				<h2 className="text-3xl font-bold flex gap-1">
					<span className="text-error">Error</span>
				</h2>
				<p>You must be logged in to create a new company page</p>
				<button
					onClick={() => signIn()}
					className="box-border border border-blue-500 text-blue-500 px-4 py-1 transition duration-300 hover:bg-blue-100 hover:border-2 rounded-full h-10 mt-2"
				>
					Login
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex justify-center md:items-center max-w-screen-xl mx-auto px-5 py-20 md:pt-0">
			<div className="flex flex-col gap-10">
				<div className="text-center flex flex-col gap-5">
					<h1 className="text-3xl text-blue-600">Create a Company Page</h1>
					<p className="text-sm">
						Connect with clients, employees, and the community.
					</p>
				</div>

				<div className="flex flex-col md:flex-row gap-5">
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-3 w-full bg-base-100 border border-base-300 rounded-lg p-5"
					>
						<div>
							<h2 className="text-lg">
								Let&apos;s get started with a few details about your company.
							</h2>
							<span className="text-xs">* indicates required</span>
						</div>

						<FormInput
							name="name"
							title="Name*"
							type="text"
							placeholder="Add your organization's name"
							size="sm"
							value={formData.name}
							onChange={handleChange}
							error={formErrors.name}
						/>
						<FormInput
							name="uniqueAddress"
							title="gethired.com/company/*"
							type="text"
							placeholder="Add your unique address"
							size="sm"
							value={formData.uniqueAddress}
							onChange={handleChange}
							error={formErrors.uniqueAddress}
						/>
						<FormInput
							name="industry"
							title="Industry"
							type="text"
							placeholder="ex: IT Services and IT Consulting"
							size="sm"
							value={formData.industry}
							onChange={handleChange}
							error={formErrors.industry}
						/>
						<FormInput
							name="tagline"
							title="Tagline"
							type="text"
							placeholder="ex: An information services firm helping small businesses succeed."
							size="sm"
							value={formData.tagline}
							onChange={handleChange}
							error={formErrors.tagline}
						/>
						<div className="flex gap-3 pt-3">
							<input
								type="checkbox"
								checked={isChecked}
								onChange={handleCheckboxChange}
								className="checkbox"
							/>
							<p className="text-sm">
								I verify that I am an authorized representative of this
								organization and have the right to act on its behalf in the
								creation and management of this page. The organization and I
								agree to the additional terms for Company Pages.
							</p>
						</div>

						<div className="pt-5">
							{submitLoading ? (
								<button
									className="btn flex ml-auto rounded-full px-10 bg-blue-600  border-blue-600 text-white"
									disabled
								>
									<FaSpinner className="w-6 h-6 animate-spin" />
								</button>
							) : (
								<button
									type="submit"
									disabled={!isChecked}
									className="btn flex ml-auto rounded-full bg-blue-600 hover:bg-blue-700 border border-blue-600 hover:border-blue-600 text-white normal-case font-bold"
								>
									Create page
								</button>
							)}
						</div>
					</form>
					<div class="flex flex-col bg-base-300 h-96 w-full rounded-lg">
						<div className="bg-base-100 rounded-t-lg p-3">
							<span className="font-semibold">Page preview</span>
						</div>
						<div class="bg-base-100 w-11/12 mx-auto my-auto rounded-lg p-5">
							<div className="flex flex-col gap-1.5">
								<Image
									src="/company.png"
									alt="company-logo"
									className="h-28 w-28"
									width={112}
									height={112}
								/>
								<h3 className="text-xl font-semibold">
									{formData.name || "Company name"}
								</h3>
								<div>
									<span className="text-sm">
										{formData.tagline || "Tagline"}
									</span>
								</div>
								<div>
									<span className="text-sm text-zinc-500">
										{formData.industry || "Industry"}
									</span>
								</div>
								<div className="pt-1.5">
									<button className="rounded-full px-5 py-1 bg-blue-600 text-white font-bold cursor-default">
										+ Follow
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewCompany;
