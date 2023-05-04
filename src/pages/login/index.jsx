import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import FormInput from "@/components/form/FormInput";
import { toast } from "react-toastify";
import { PuffLoader } from "react-spinners";
import { FaSpinner } from "react-icons/fa";

const Login = () => {
	const router = useRouter();
	const { data, status } = useSession();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [formErrors, setFormErrors] = useState({ email: "", password: "" });
	const [submitLoading, setSubmitLoading] = useState(false);

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
		setFormErrors({ ...formErrors, [name]: "" });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitLoading(true);

		const errors = {};

		if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
			errors.email = "Please enter a valid email address";
		}

		if (!formData.password) {
			errors.password = "Required";
		}

		if (Object.keys(errors).length === 0) {
			const res = await signIn("credentials", {
				email: formData.email,
				password: formData.password,
				redirect: false,
			});

			if (!res.error) {
				toast.success(`Logged in sucessfully`);
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
			<div className="min-h-screen flex justify-center items-center">
				<PuffLoader />
			</div>
		);
	}

	if (status === "authenticated" && data.user.employer) {
		router.replace("/dashboard");

		return null;
	}

	if (status === "authenticated" && !data.user.employer) {
		router.replace("/jobs");

		return null;
	}

	return (
		<div className="hero min-h-screen bg-base-100">
			<Head>
				<title>Login</title>
			</Head>
			<div className="hero-content flex flex-col gap-10 md:w-[600px]">
				<h1 className="text-3xl text-blue-600">
					Join our community of job seekers and employers today and take the
					first step towards achieving your career goals
				</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
					<FormInput
						name="email"
						title="Email"
						type="email"
						placeholder="Enter email"
						value={formData.email}
						onChange={handleChange}
						error={formErrors.email}
						autoFocus
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
								Sign in
							</button>
						)}
					</div>
					<div className="divider">or</div>
					<div>
						<Link href="/signup">
							<button className="w-full rounded-full py-3 bg-base-100 hover:bg-base-200 border border-zinc-600 normal-case font-bold">
								New to GetHired? Join now
							</button>
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
