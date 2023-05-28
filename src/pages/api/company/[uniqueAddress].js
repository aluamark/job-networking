import connectMongo from "@/utils/connectMongo";
import Company from "@/models/Company";
import Job from "@/models/Job";

export default async function first(req, res) {
	const { uniqueAddress } = req.query;
	await connectMongo();

	switch (req.method) {
		case "GET":
			try {
				const companyData = await Company.findOne({ uniqueAddress })
					.populate("jobs")
					.exec();
				if (!companyData) {
					res.status(404).send({ error: "Company not found" });
				}

				res.status(200).send(companyData);
			} catch (error) {
				res.status(500).send({ error: "Internal server error" });
			}
			break;

		case "PUT":
			try {
				const company = await Company.findOne({ uniqueAddress });
				if (!company) {
					res.status(404).send({ error: "Company not found" });
				}

				const companyData = req.body;
				if (companyData) {
					company.set(req.body);
					const updatedCompany = await company.save();

					res
						.status(200)
						.send({ message: "Save was successful.", updatedCompany });
				} else {
					res.status(404).send({ error: "Missing data" });
				}
			} catch (error) {
				res.status(500).send({ error: "Internal server error" });
			}
			break;

		default:
			res.setHeader("Allow", ["GET", "PUT"]);
			res.status(405).send({ error: `Method ${req.method} not allowed` });
			break;
	}
}
