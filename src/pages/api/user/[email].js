import connectMongo from "@/utils/connectMongo";
import User from "@/models/User";
import Company from "@/models/Company";
import Job from "@/models/Job";
import JobApplication from "@/models/JobApplication";

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
				path: "postedJobs",
				populate: {
					path: "company applications",
				},
			})
			.populate({
				path: "adminPages",
				select: "uniqueAddress name picturePath",
			})
			.populate({
				path: "jobApplications",
				populate: {
					path: "job",
					populate: {
						path: "company",
					},
				},
			});

		if (!user) {
			return res.status(404).send({ error: "No user found" });
		}

		return res.status(200).send(user);
	} catch (error) {
		return res.status(500).send({ error: "Internal server error" });
	}
}
