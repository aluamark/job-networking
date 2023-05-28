import connectMongo from "@/utils/connectMongo";
import User from "@/models/User";
import Company from "@/models/Company";

export default async function handler(req, res) {
	const { email } = req.query;

	try {
		if (req.method !== "GET") {
			return res.status(405).send({ error: "Method not allowed" });
		}

		await connectMongo();

		const user = await User.findOne({ email })
			.populate({
				path: "savedJobs",
				populate: {
					path: "company",
					model: "Company",
				},
			})
			.populate({
				path: "adminPages",
				select: "uniqueAddress name picturePath",
			});

		if (!user) {
			return res.status(404).send({ error: "No user found" });
		}

		return res.status(200).send(user);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: "Internal server error" });
	}
}
