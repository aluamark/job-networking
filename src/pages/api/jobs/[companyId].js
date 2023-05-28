import connectMongo from "@/utils/connectMongo";
import Job from "@/models/Job";
import Company from "@/models/Company";

export default async function handler(req, res) {
	const { companyId } = req.query;
	try {
		if (req.method !== "GET") {
			return res
				.status(405)
				.send({ error: `Method ${req.method} not allowed` });
		}

		await connectMongo();

		const jobs = await Job.find({ company: companyId }).populate(
			"company postedBy"
		);

		return res.status(200).send(jobs);
	} catch (error) {
		return res.status(500).send({ error: "Internal server error" });
	}
}
