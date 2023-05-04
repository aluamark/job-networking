import React, { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { MdOutlineAccountCircle } from "react-icons/md";

const Sidebar = () => {
	const { data, status } = useSession();
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		if (status === "authenticated" && data.user) {
			setAuthenticated(true);
		}
	}, [status]);

	return (
		<nav className="drawer-side">
			<label htmlFor="my-drawer-3" className="drawer-overlay"></label>
			<ul className="menu p-4 w-80 bg-base-100">
				{authenticated ? (
					<>
						<li>
							<button>
								<MdOutlineAccountCircle className="w-6 h-6" />
								{data.user.firstName} {data.user.lastName}
							</button>
						</li>
						<li>
							<button onClick={() => signOut()}>Logout</button>
						</li>
					</>
				) : (
					<li>
						<button onClick={() => signIn()}>Login</button>
					</li>
				)}
			</ul>
		</nav>
	);
};

export default Sidebar;
