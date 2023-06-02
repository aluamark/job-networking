import connectMongo from "@/utils/connectMongo";
import User from "@/models/User";
import Company from "@/models/Company";
import Job from "@/models/Job";

export default async function handler(req, res) {
	const { keywords } = req.query;
	try {
		if (req.method !== "GET") {
			return res.status(405).send({ error: "Method not allowed" });
		}

		await connectMongo();

		const people = await User.find({
			firstName: { $regex: `^${keywords}`, $options: "i" },
		});

		// Search for company names
		const companies = await Company.find({
			name: { $regex: `^${keywords}`, $options: "i" },
		});

		const companyIds = companies.map((company) => company._id);

		const jobsByCompany = await Job.find({
			company: { $in: companyIds },
		}).populate("company");

		// Search for job titles
		const jobsByTitle = await Job.find({
			title: { $regex: `^${keywords}`, $options: "i" },
		}).populate("company");

		// Search for jobs by skills
		const jobsBySkills = await Job.find({
			skills: { $regex: `^${keywords}`, $options: "i" },
		}).populate("company");

		// Combine the results
		const results = {
			people,
			companies,
			jobsByCompany,
			jobsByTitle,
			jobsBySkills,
		};

		res.status(200).json(results);
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: "Internal server error" });
	}
}
