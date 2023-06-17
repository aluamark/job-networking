import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getCompany } from "@/lib/helper";
import OwnPage from "@/components/company/OwnPage";
import ViewPage from "@/components/company/ViewPage";
import Loading from "@/components/widgets/Loading";

const Company = () => {
	const router = useRouter();
	const { uniqueAddress } = router.query;
	const { data, status } = useSession();

	const company = useQuery({
		queryKey: ["companyProfile", uniqueAddress],
		queryFn: () => getCompany(uniqueAddress),
		enabled: !!uniqueAddress,
		retry: false,
		refetchOnWindowFocus: false,
	});

	if (status === "loading" || company.isLoading) return <Loading />;

	if (company.isError) {
		return (
			<div className="min-h-screen bg-base-100">
				<div className="max-w-screen-sm mx-auto flex flex-col gap-3 items-center py-[4rem]">
					<Image src="/404.gif" alt="404" width={500} height={500} />
					<h2 className="text-3xl font-bold flex gap-1.5">
						<span className="text-error">404:</span>
						{company.error.response.data.error}
					</h2>
					<p className="text-center">
						Please check your URL or return to EmployX home.
					</p>
					<Link
						href="/"
						className="flex items-center box-border border border-blue-500 text-blue-500 px-4 py-1 transition duration-150 hover:bg-blue-100 hover:border-2 rounded-full h-10 mt-2 font-semibold"
					>
						Go to EmployX home
					</Link>
				</div>
			</div>
		);
	}

	if (
		status === "authenticated" &&
		company?.data?.admins.includes(data.user._id)
	) {
		return <OwnPage company={company} />;
	}

	return <ViewPage company={company} />;
};

export default Company;
