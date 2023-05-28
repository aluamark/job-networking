import connectMongo from "@/utils/connectMongo";
import Job from "@/models/Job";
import Company from "@/models/Company";
import User from "@/models/User";

export default async function handler(req, res) {
	try {
		if (req.method !== "GET") {
			return res
				.status(405)
				.send({ error: `Method ${req.method} not allowed` });
		}

		await connectMongo();

		const jobs = await Job.find().populate("company postedBy").exec();

		return res.status(200).send(jobs);
	} catch (error) {
		return res.status(500).send({ error: "Internal server error" });
	}
}
