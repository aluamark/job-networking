import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../helper";

export const useJobsQuery = () =>
	useQuery({
		queryKey: ["jobs"],
		queryFn: getJobs,
		refetchOnWindowFocus: false,
	});
