import React, { useEffect } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "@/lib/helper";
import { setLoggedUser } from "@/redux/reducer";

const Navbar = () => {
	const dispatch = useDispatch();
	const { data, status } = useSession();
	const picturePath = useSelector((state) => state.user?.picturePath);

	const fetchUser = async (email) => {
		const fetchedUser = await getUser(email);
		dispatch(setLoggedUser(fetchedUser));
	};

	useEffect(() => {
		if (status === "authenticated" && data.user.email) {
			fetchUser(data.user.email);
		}
	}, [status]);

	return (
		<nav className="fixed navbar bg-base-100 border-b border-base-300 z-50 text-sm font-semibold">
			<div className="max-w-screen-xl w-full mx-auto">
				<div className="flex-1">
					<Link
						href={`${
							status === "authenticated" && data.user.employer
								? "/dashboard"
								: "/jobs"
						}`}
					>
						<button className="p-3">GetHired</button>
					</Link>
				</div>
				<div className="flex-none hidden md:block">
					<ul className="menu menu-horizontal px-3">
						<Link href="/jobs">
							<li>
								<button className="btn btn-ghost normal-case">Jobs</button>
							</li>
						</Link>
						<div className="divider divider-horizontal p-0 m-0"></div>
						{status === "authenticated" ? (
							<li className="dropdown dropdown-end">
								<button tabIndex={0} className="btn btn-ghost btn-circle p-0">
									<img
										src={picturePath ? picturePath : "/default.png"}
										alt="profile-picture"
										className="rounded-full w-10 h-10 object-cover"
									/>
								</button>
								<ul
									tabIndex={0}
									className="dropdown-content menu p-1 shadow bg-base-100 border border-base-300 rounded-box w-52"
								>
									<Link href={`/gh/${data.user.email}`}>
										<li>
											<button className="w-full active:bg-base-300">
												{data.user.firstName} {data.user.lastName}
											</button>
										</li>
									</Link>
									<li>
										<button
											onClick={() =>
												signOut({ callbackUrl: `${window.location.origin}` })
											}
											className="w-full active:bg-base-300"
										>
											Logout
										</button>
									</li>
								</ul>
							</li>
						) : (
							<ul className="flex items-center gap-2">
								<Link href="/signup">
									<li>
										<button className="btn btn-ghost normal-case">
											Join now
										</button>
									</li>
								</Link>
								<li>
									<button
										className="bg-base-100 hover:bg-blue-100 border border-blue-600 text-blue-600 normal-case"
										onClick={() => signIn()}
									>
										Sign in
									</button>
								</li>
							</ul>
						)}
					</ul>
				</div>
				<div className="flex-none md:hidden">
					<label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							className="inline-block w-6 h-6 stroke-current"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h16"
							></path>
						</svg>
					</label>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
