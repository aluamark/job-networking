import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";

const Sidebar = () => {
	const { data, status } = useSession();

	const user = useLoggedUserQuery();

	if (status === "unauthenticated")
		return (
			<nav className="drawer-side">
				<label htmlFor="my-drawer-3" className="drawer-overlay"></label>
				<ul className="menu p-4 w-80 bg-base-100">
					<li>
						<Link href="/signup">
							<button>Join now</button>
						</Link>
					</li>

					<li>
						<button onClick={() => signIn()}>Sign in</button>
					</li>
				</ul>
			</nav>
		);

	if (user.data)
		return (
			<nav className="drawer-side">
				<label htmlFor="my-drawer-3" className="drawer-overlay"></label>
				<ul className="menu p-4 w-80 bg-base-100">
					<li>
						<Link href={`/gh/${user.data.email}`} className="flex gap-3">
							<Image
								src={
									user.data.picturePath ? user.data.picturePath : "/default.png"
								}
								alt="dropdown-profile-picture"
								className="rounded-full w-10 h-10 object-cover"
								width={40}
								height={40}
							/>
							{user.data.firstName} {user.data.lastName}
						</Link>
					</li>
					<li>
						<Link href={`/jobs`}>Jobs</Link>
					</li>
					<li>
						<button onClick={() => signOut()}>Logout</button>
					</li>
				</ul>
			</nav>
		);
};

export default Sidebar;
