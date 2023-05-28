import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setTableData, setSearch } from "@/redux/reducer";
import { getEmployees } from "@/lib/helper";
import { useSession } from "next-auth/react";
import { PuffLoader } from "react-spinners";
import { FaUserPlus } from "react-icons/fa";
import EmployeeTable from "@/components/table/EmployeeTable";
import Search from "@/components/table/Search";

const Dashboard = () => {
	const { status } = useSession();
	const dispatch = useDispatch();
	const [searchValue, setSearchValue] = useState("");
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchTableData = async () => {
		const tableData = await getEmployees();
		setEmployees(tableData);
		dispatch(setTableData(tableData));
		setLoading(false);
	};

	useEffect(() => {
		if (searchValue.trim() !== "") {
			dispatch(setSearch(searchValue.toLowerCase()));
		} else {
			dispatch(setTableData(employees));
		}
	}, [searchValue]);

	useEffect(() => {
		setLoading(true);
		if (status === "authenticated") {
			fetchTableData();
		}
	}, [status]);

	if (status === "loading") {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<PuffLoader />
			</div>
		);
	}

	return (
		<div className="pt-20 px-5">
			<Head>
				<title>Dashboard</title>
			</Head>
			<h1 className="text-xl font-bold">Dashboard</h1>
			<div className="flex justify-between items-center mt-5">
				<Search searchValue={searchValue} setSearchValue={setSearchValue} />
				<Link href="/employee/create">
					<button className="btn btn-md btn-success btn-square">
						<FaUserPlus className="w-5 h-5" />
					</button>
				</Link>
			</div>
			<EmployeeTable loading={loading} />
		</div>
	);
};

export default Dashboard;
