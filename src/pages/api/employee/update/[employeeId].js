import connectMongo from "@/utils/connectMongo";
import Employee from "@/models/Employee";
import mongoose from "mongoose";

export default async function handler(req, res) {
	const { employeeId } = req.query;

	try {
		if (req.method !== "PUT") {
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

		const updatedEmployee = req.body;
		if (updatedEmployee) {
			await Employee.findByIdAndUpdate(employeeId, updatedEmployee);
			return res
				.status(200)
				.send({ message: "Updated employee successfully", updatedEmployee });
		} else {
			return res.status(404).send({ error: "Missing data" });
		}
	} catch (error) {
		console.error("Error updating employee: ", error);
		return res.status(500).send({ error: "Internal server error" });
	}
}
