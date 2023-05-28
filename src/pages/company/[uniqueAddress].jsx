import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompany, updateCompany, getRandomUsers } from "@/lib/helper";
import { PuffLoader } from "react-spinners";
import OwnPage from "@/components/company/OwnPage";
import ViewPage from "@/components/company/ViewPage";

const Company = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { uniqueAddress } = router.query;
	const { data, status } = useSession();

	const company = useQuery({
		queryKey: ["companyProfile", uniqueAddress],
		queryFn: () => getCompany(uniqueAddress),
		enabled: !!uniqueAddress,
		retry: false,
		refetchOnWindowFocus: false,
	});

	const createUpdateMutation = useMutation({
		mutationFn: updateCompany,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["companyProfile"],
			});
		},
	});

	const randomUsers = useQuery({
		queryKey: ["people"],
		queryFn: getRandomUsers,
		enabled: !!uniqueAddress,
		refetchOnWindowFocus: false,
	});

	if (status === "loading" || company.isLoading || randomUsers.isLoading)
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-10">
				<span className="text-5xl font-extrabold text-blue-600">GetHired</span>
				<PuffLoader />
			</div>
		);

	if (company.isError || randomUsers.isError) {
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-3">
				<h2 className="text-3xl font-bold flex gap-1">
					<span className="text-error">Error:</span>
					{company.error.response.data.error}
				</h2>
				<p>Please check your URL or return to Jobs.</p>
				<Link href="/jobs">
					<button className="box-border border border-blue-500 text-blue-500 px-4 py-1 transition duration-300 hover:bg-blue-100 hover:border-2 rounded-full h-10 mt-2">
						Go to Jobs
					</button>
				</Link>
			</div>
		);
	}

	if (
		status === "authenticated" &&
		company?.data?.admins.includes(data.user._id)
	) {
		return (
			<OwnPage
				company={company}
				randomUsers={randomUsers}
				createUpdateMutation={createUpdateMutation}
			/>
		);
	}

	return <ViewPage company={company} randomUsers={randomUsers} />;
};

export default Company;
