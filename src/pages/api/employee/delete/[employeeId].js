import connectMongo from "@/utils/connectMongo";
import Employee from "@/models/Employee";
import mongoose from "mongoose";

export default async function handler(req, res) {
	const { employeeId } = req.query;

	try {
		if (req.method !== "DELETE") {
			return res.status(405).send({ error: "Method not allowed" });
		}

		await connectMongo();

		if (!mongoose.isValidObjectId(employeeId)) {
			return res.status(400).send({ error: "Invalid employee ID" });
		}

		const employee = await Employee.findById(employeeId);
		if (!employee) {
			return res.status(404).send({ error: "Employee not found" });
		}

		await employee.deleteOne();

		return res.send({ message: "Removed employee successfully" });
	} catch (error) {
		console.error("Error deleting user: ", error);
		return res.status(500).send({ error: "Internal server error" });
	}
}
