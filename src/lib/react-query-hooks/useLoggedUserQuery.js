import { useQuery } from "@tanstack/react-query";
import { getUser } from "../helper";
import { useSession } from "next-auth/react";

export const useLoggedUserQuery = () => {
	const { data } = useSession();
	const email = data?.user?.email;

	return useQuery({
		queryKey: ["loggedUser"],
		queryFn: () => getUser(email),
		enabled: !!email,
		refetchOnWindowFocus: false,
	});
};
