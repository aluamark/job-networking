import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { BsBriefcaseFill } from "react-icons/bs";
import Search from "./Search";
import SearchFilter from "./SearchFilter";

const Navbar = ({ user }) => {
	const router = useRouter();
	const { data, status } = useSession();

	if (user?.isLoading || status === "loading") {
		<nav className="fixed navbar bg-base-100 border-b border-base-300 z-50 text-sm font-semibold">
			<div className="max-w-screen-xl w-full mx-auto">
				<div className="flex-1">
					<Image src="/employx.png" alt="website-logo" width={40} height={40} />
				</div>
				<div className="flex-none hidden md:block">
					<ul className="menu menu-horizontal px-3"></ul>
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
		</nav>;
	}

	return (
		<nav className="fixed top-0 navbar bg-base-100 border-b border-base-300 text-sm p-0 z-50">
			<div className="max-w-screen-xl w-full mx-auto">
				<div className="flex items-center flex-1 gap-3 px-3">
					<Link href={`${status === "authenticated" ? "/jobs" : "/"}`}>
						<button className="font-semibold flex items-center">
							<Image
								src="/employx.png"
								alt="website-logo"
								width={40}
								height={40}
								className="animate-pulse"
							/>
						</button>
					</Link>
					{router.asPath.startsWith("/jobs/search") ? (
						<SearchFilter searchHistory={user?.data?.searchHistory} />
					) : (
						<Search searchHistory={user?.data?.searchHistory} />
					)}
				</div>
				<div className="flex-none hidden md:block">
					<ul className="menu menu-horizontal px-3">
						{status === "authenticated" && user.data && (
							<>
								<Link href="/jobs">
									<li>
										<button className="btn btn-ghost normal-case">
											<BsBriefcaseFill />
											Jobs
										</button>
									</li>
								</Link>
								<div className="divider divider-horizontal p-0 m-0"></div>
								<li className="dropdown dropdown-end">
									<button tabIndex={0} className="btn btn-ghost btn-circle p-0">
										<Image
											tabIndex={0}
											src={
												user.data.picturePath
													? user.data.picturePath
													: "/default.png"
											}
											alt="profile-picture"
											className="border border-base-300 rounded-full w-10 h-10 object-cover"
											width={40}
											height={40}
										/>
									</button>
									<ul
										tabIndex={0}
										className="dropdown-content menu shadow bg-base-100 border border-base-300 rounded-box w-64 font-normal"
									>
										<Link href={`/ex/${data.user.email}`}>
											<li className="border-b border-base-300">
												<div className="w-full active:bg-base-300 hover:bg-base-100 px-3">
													<Image
														src={
															user.data.picturePath
																? user.data.picturePath
																: "/default.png"
														}
														alt="dropdown-profile-picture"
														className="rounded-full w-10 h-10 object-cover"
														width={40}
														height={40}
													/>
													<div className="flex flex-col">
														<span className="font-semibold">
															{data.user.firstName} {data.user.lastName}
														</span>
														<span className="whitespace-normal text-xs text-zinc-500">
															{data.user.headline}
														</span>
													</div>
												</div>
											</li>
										</Link>
										<div className="flex flex-col gap-1.5 py-2.5 px-3">
											<li className="font-semibold">Manage</li>
											<Link href="/job-posting">
												<li className="link link-hover text-xs w-full active:bg-base-300 hover:bg-base-100">
													Company Pages
												</li>
											</Link>
											<Link href="/job-posting/new">
												<li className="link link-hover text-xs w-full active:bg-base-300 hover:bg-base-100">
													Job Posting
												</li>
											</Link>
										</div>

										<li
											onClick={() =>
												signOut({ callbackUrl: `${window.location.origin}` })
											}
											className="link link-hover text-xs border-t border-base-300 w-full active:bg-base-300 hover:bg-base-100 py-2.5 px-3"
										>
											Sign Out
										</li>
									</ul>
								</li>
							</>
						)}

						{status === "unauthenticated" && (
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
