import { useQuery } from "@tanstack/react-query";
import { getRandomUsers } from "../helper";

export const useRandomUsersQuery = () =>
	useQuery({
		queryKey: ["people"],
		queryFn: getRandomUsers,
		refetchOnWindowFocus: false,
	});
