import { useQuery } from "@tanstack/react-query";
import { search } from "../helper";

export const useSearchQuery = (keywords) =>
	useQuery({
		queryKey: ["search", keywords],
		queryFn: () => search(keywords),
		enabled: !!keywords,
		refetchOnWindowFocus: false,
	});
