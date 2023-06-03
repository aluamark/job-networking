import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";
import { BsBriefcaseFill, BsFillBookmarkCheckFill } from "react-icons/bs";

const BottomNav = () => {
	const { data, status } = useSession();
	const user = useLoggedUserQuery();
	const [active, setActive] = useState(0);

	if (status === "unauthenticated")
		return (
			<div className="btm-nav md:hidden text-sm">
				<Link href="/jobs" className="active">
					<BsBriefcaseFill />
				</Link>
				<Link href="/signup" className="active">
					Join now
				</Link>
				<button onClick={() => signIn()} className="active">
					Sign in
				</button>
			</div>
		);

	if (user.data)
		return (
			<div className="btm-nav md:hidden">
				<Link
					href="/jobs"
					className={`${active === 0 && "active"}`}
					onClick={() => setActive(0)}
				>
					<BsBriefcaseFill />
				</Link>
				<Link
					href={`/gh/${user.data.email}`}
					className={`flex gap-3 ${active === 1 && "active"}`}
					onClick={() => setActive(1)}
				>
					<Image
						src={user.data.picturePath ? user.data.picturePath : "/default.png"}
						alt="dropdown-profile-picture"
						className="rounded-full w-10 h-10 object-cover"
						width={40}
						height={40}
					/>
				</Link>
				<Link
					href="/my-items/saved-jobs"
					className={`${active === 2 && "active"}`}
					onClick={() => setActive(2)}
				>
					<BsFillBookmarkCheckFill />
				</Link>
			</div>
		);
};

export default BottomNav;
