import React from "react";
import Link from "next/link";
import { deleteEmployee } from "@/lib/helper";
import { useSelector, useDispatch } from "react-redux";
import { setDeleteEmployee } from "@/redux/reducer";
import { MdDelete, MdEdit } from "react-icons/md";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import Table from "./Table";

const EmployeeTable = ({ loading }) => {
	const dispatch = useDispatch();
	const employees = useSelector((state) => state.tableData.employees);

	const handleDelete = async (employeeId) => {
		const { message } = await deleteEmployee(employeeId);
		if (message === "Removed employee successfully") {
			toast.error(message);
			dispatch(setDeleteEmployee(employeeId));
		} else {
			toast.error(message);
		}
	};

	if (loading)
		return (
			<div className="flex justify-center border border-base-300 rounded-box py-5 my-5">
				<PuffLoader />
			</div>
		);

	if (!employees)
		return (
			<div className="flex justify-center border border-base-300 rounded-box py-5 my-5">
				No table data available
			</div>
		);

	return (
		<Table>
			{employees.map((employee) => {
				return (
					<tr key={employee._id}>
						<td className="pl-5">
							<div className="flex items-center space-x-3">
								<div>
									<div className="font-bold">
										{employee.firstName} {employee.lastName}
									</div>
									<div className="text-sm opacity-50">{employee.location}</div>
								</div>
							</div>
						</td>
						<td>
							{employee.email}
							<br />
							<span className="badge badge-ghost badge-sm">gmail</span>
						</td>
						<th>
							<div className="flex gap-1">
								<div className="tooltip flex gap-1" data-tip="Delete">
									<button
										onClick={() => handleDelete(employee._id)}
										className="btn btn-sm btn-square"
									>
										<MdDelete className="w-5 h-5" />
									</button>
								</div>
								<div className="tooltip flex gap-1" data-tip="Edit">
									<Link href={`/employee/update/${employee._id}`}>
										<button className="btn btn-sm btn-square">
											<MdEdit className="w-5 h-5" />
										</button>
									</Link>
								</div>
							</div>
						</th>
					</tr>
				);
			})}
		</Table>
	);
};

export default EmployeeTable;
