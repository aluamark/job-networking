import connectMongo from "@/utils/connectMongo";
import Company from "@/models/Company";
import User from "@/models/User";

export default async function handler(req, res) {
	try {
		if (req.method !== "POST") {
			return res
				.status(405)
				.send({ error: `Method ${req.method} not allowed` });
		}

		await connectMongo();

		const { uniqueAddress, name, admins } = req.body;

		const existingCompany = await Company.findOne({ uniqueAddress, name });
		if (existingCompany) {
			return res
				.status(409)
				.send({ error: "There is already a company with the same name" });
		}

		const newCompany = new Company(req.body);
		const savedCompany = await newCompany.save();

		if (savedCompany) {
			const userId = admins[0];
			const user = await User.findById(userId);

			if (!user) {
				return res.status(404).send({ error: "No user found" });
			}

			user.adminPages.push(savedCompany._id);
			await user.save();
		}

		return res.status(201).send({
			message: "Company created successfully",
			company: savedCompany,
		});
	} catch (error) {
		return res.status(500).send({ error: "Internal server error" });
	}
}
