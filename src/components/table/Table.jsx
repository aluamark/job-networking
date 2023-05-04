import React from "react";
import { useDispatch } from "react-redux";
import { setTableData } from "@/redux/reducer";
import { getEmployees } from "@/lib/helper";
import { MdRefresh } from "react-icons/md";

const Table = ({ children }) => {
	const dispatch = useDispatch();

	const handleReload = async () => {
		const employees = await getEmployees();
		dispatch(setTableData(employees));
	};

	return (
		<div className="overflow-x-auto my-5">
			<table className="table table-compact w-full">
				<thead>
					<tr className="border-b border-base-200">
						<td className="pl-5 bg-base-100">Employee</td>
						<th className="bg-base-100">Email</th>
						<th className="flex justify-between items-center bg-base-100">
							Actions
							<button
								onClick={handleReload}
								className="btn btn-sm btn-ghost btn-square"
							>
								<MdRefresh className="w-5 h-5" />
							</button>
						</th>
					</tr>
				</thead>
				<tbody>{children}</tbody>
			</table>
		</div>
	);
};

export default Table;
