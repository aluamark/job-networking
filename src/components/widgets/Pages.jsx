import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Pages = ({ randomUsers }) => {
	const router = useRouter();
	const { email } = router.query;
	const userEmail = useSelector((state) => state.user?.email);

	if (randomUsers)
		return (
			<div className="flex flex-col divide-y divide-base-300 text-sm">
				{randomUsers
					?.filter((user) => user.email !== userEmail && user.email !== email)
					.map((user) => {
						return (
							<Link href={`/gh/${user.email}`} key={user._id}>
								<div className="flex gap-3 w-full py-3">
									<img
										src={user.picturePath ? user.picturePath : "/default.png"}
										alt="picture"
										className="w-14 h-14 rounded-full object-cover"
									/>
									<div>
										<div>
											<span className="font-semibold">
												{user.firstName} {user.lastName}
											</span>
										</div>
										<div>
											<span className="text-zinc-500 text-xs">
												{user.headline}
											</span>
										</div>

										<div className="pt-2">
											<button className="btn btn-outline btn-sm rounded-full">
												Connect
											</button>
										</div>
									</div>
								</div>
							</Link>
						);
					})}
			</div>
		);
};

export default Pages;
