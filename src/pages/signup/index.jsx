import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import FormInput from "@/components/form/FormInput";
import { toast } from "react-toastify";
import { createUser } from "@/lib/helper";
import { FaSpinner } from "react-icons/fa";
import Loading from "@/components/widgets/Loading";

const SignUp = () => {
	const router = useRouter();
	const { status } = useSession();
	const [formData, setFormData] = useState({
		employer: false,
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [formErrors, setFormErrors] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [submitLoading, setSubmitLoading] = useState(false);

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
		setFormErrors({ ...formErrors, [name]: "" });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitLoading(true);

		// check for errors
		const errors = {};

		if (!formData.firstName) {
			errors.firstName = "Required";
		}

		if (!formData.lastName) {
			errors.lastName = "Required";
		}

		if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
			errors.email = "Please enter a valid email address";
		}

		if (!formData.password) {
			errors.password = "Required";
		}

		// check if errors variable is empty
		if (Object.keys(errors).length === 0) {
			const user = await createUser(formData);

			if (user) {
				toast.success(`Registered sucessfully.`);
				router.push("/login");
			} else {
				toast.error(res.error);
			}
		} else {
			setFormErrors(errors);
		}

		setSubmitLoading(false);
	};

	if (status === "loading") {
		return <Loading />;
	}

	if (status === "authenticated") {
		router.replace("/dashboard");

		return null;
	}

	return (
		<div className="hero min-h-screen bg-base-100 py-20">
			<Head>
				<title>Sign Up | EmployX</title>
			</Head>
			<div className="hero-content flex flex-col gap-10 md:w-[600px]">
				<h1 className="text-3xl text-blue-600">
					Find your dream job or the perfect candidate with our innovative job
					posting website
				</h1>
				<form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
					<div className="flex flex-col md:flex-row gap-3">
						<FormInput
							name="firstName"
							title="First Name"
							type="text"
							placeholder="Enter your first name"
							value={formData.firstName}
							onChange={handleChange}
							error={formErrors.firstName}
						/>
						<FormInput
							name="lastName"
							title="Last Name"
							type="text"
							placeholder="Enter your last name"
							value={formData.lastName}
							onChange={handleChange}
							error={formErrors.lastName}
						/>
					</div>

					<FormInput
						name="email"
						title="Email"
						type="email"
						placeholder="Enter email"
						value={formData.email}
						onChange={handleChange}
						error={formErrors.email}
					/>
					<FormInput
						name="password"
						title="Password"
						type="password"
						placeholder="Enter password"
						value={formData.password}
						onChange={handleChange}
						error={formErrors.password}
					/>
					<div className="pt-5">
						{submitLoading ? (
							<button
								className="w-full rounded-full py-3 bg-blue-600 border border-blue-600 flex justify-center"
								disabled
							>
								<FaSpinner className="w-6 h-6 animate-spin" />
							</button>
						) : (
							<button
								type="submit"
								className="w-full rounded-full py-3 bg-blue-600 hover:bg-blue-700 border border-blue-600 text-white normal-case font-bold"
							>
								Sign up
							</button>
						)}
					</div>
					<div className="divider">or</div>
					<p className="text-center">
						Already on EmployX?{" "}
						<a
							onClick={() => signIn()}
							className="link link-hover text-blue-600"
						>
							Sign in
						</a>
					</p>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
