import connectMongo from "@/utils/connectMongo";
import Employee from "@/models/Employee";

export default async function handler(req, res) {
	try {
		await connectMongo();

		const { firstName, lastName, email, location } = req.body;

		const existingUser = await Employee.findOne({ email });
		if (existingUser) {
			return res.status(409).send({ error: "Email already registered" });
		}

		const newEmployee = new Employee({ firstName, lastName, email, location });
		const savedEmployee = await newEmployee.save();

		return res.status(201).send({
			message: "Created employee successfully",
			employee: savedEmployee,
		});
	} catch (error) {
		console.error("Error creating employee: ", error);
		return res.status(500).send({ error: "Internal server error" });
	}
}
