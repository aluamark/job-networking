import { useQuery } from "@tanstack/react-query";
import { getJob } from "../helper";

export const useJobQuery = (jobId) =>
	useQuery({
		queryKey: ["job", jobId],
		queryFn: () => getJob(jobId),
		enabled: !!jobId,
		retry: false,
		refetchOnWindowFocus: false,
	});
