import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { BsBriefcaseFill, BsFillBookmarkCheckFill } from "react-icons/bs";

const BottomNav = ({ user }) => {
	const { status } = useSession();
	const [active, setActive] = useState(0);

	if (status === "unauthenticated")
		return (
			<div className="btm-nav md:hidden text-sm">
				<Link href="/jobs" className="active">
					<BsBriefcaseFill />
				</Link>
			</div>
		);

	if (status === "authenticated" && user?.data)
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
					href={`/ex/${user.data.email}`}
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
