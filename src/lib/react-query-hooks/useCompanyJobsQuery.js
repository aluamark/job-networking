import { useQuery } from "@tanstack/react-query";
import { getCompanyJobs } from "../helper";

export const useCompanyJobsQuery = (companyId) =>
	useQuery({
		queryKey: ["jobs", companyId],
		queryFn: () => getCompanyJobs(companyId),
		enabled: !!companyId,
		refetchOnWindowFocus: false,
	});
