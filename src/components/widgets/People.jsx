import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const People = ({ randomUsers, userEmail }) => {
	const router = useRouter();
	const { email } = router.query;

	if (randomUsers)
		return (
			<div className="bg-base-100 border border-base-300 rounded-lg p-5">
				<h3 className="font-semibold">People you may know</h3>
				<div className="flex flex-col divide-y divide-base-300 text-sm">
					{randomUsers
						?.filter((user) => user.email !== userEmail && user.email !== email)
						.map((user) => {
							return (
								<Link href={`/gh/${user.email}`} key={user._id}>
									<div className="flex gap-3 w-full py-3">
										<div className="flex-none">
											<Image
												src={
													user.picturePath ? user.picturePath : "/default.png"
												}
												alt="picture"
												className="rounded-full w-12 h-12 object-cover"
												width={48}
												height={48}
											/>
										</div>
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

											<div className="pt-1">
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
			</div>
		);
};

export default People;
