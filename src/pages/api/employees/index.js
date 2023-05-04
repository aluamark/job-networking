import connectMongo from "@/utils/connectMongo";
import Employee from "@/models/Employee";

export default async function handler(req, res) {
	try {
		if (req.method !== "GET") {
			return res.status(405).send({ error: "Method not allowed" });
		}

		await connectMongo();

		const employees = await Employee.find();

		return res.status(200).send(employees);
	} catch (error) {
		console.error("Error fetching employees: ", error);
		return res.status(500).send({ error: "Internal server error" });
	}
}
