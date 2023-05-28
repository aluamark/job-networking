import connectMongo from "@/utils/connectMongo";
import Job from "@/models/Job";
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

		const {
			company,
			postedBy,
			title,
			city,
			country,
			locationType,
			employmentType,
			description,
			skills,
		} = req.body;

		const companyData = await Company.findById(company);
		if (!companyData) {
			return res.status(404).send({ error: "Company not found" });
		}

		const userData = await User.findById(postedBy);
		if (!userData) {
			return res.status(404).send({ error: "User not found" });
		}

		const newJob = new Job({
			company,
			postedBy,
			title,
			description,
			city,
			country,
			locationType,
			employmentType,
			skills,
		});
		const savedJob = await newJob.save();

		companyData.jobs.push(savedJob._id);
		await companyData.save();

		userData.postedJobs.push(savedJob._id);
		await userData.save();

		return res.status(201).send({
			message: "Created job posting successfully",
			job: savedJob,
		});
	} catch (error) {
		return res.status(500).send({ error: "Internal server error" });
	}
}
