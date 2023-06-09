import { useQuery } from "@tanstack/react-query";
import { getRandomCompanies } from "../helper";

export const useRandomCompaniesQuery = () =>
	useQuery({
		queryKey: ["pages"],
		queryFn: getRandomCompanies,
		refetchOnWindowFocus: false,
	});
