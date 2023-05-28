import connectMongo from "@/utils/connectMongo";
import Company from "@/models/Company";

export default async function handler(req, res) {
	try {
		if (req.method !== "GET") {
			return res
				.status(405)
				.send({ error: `Method ${req.method} not allowed` });
		}

		await connectMongo();

		const specialChars = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
		const { query } = req.query;

		if (!specialChars.test(query.trim())) {
			const company = await Company.findOne({ uniqueAddress: query });
			if (company) {
				return res.status(409).send({ error: "Public URL is already in use" });
			}
		}

		return res.status(200).send({ message: "Public URL is available" });
	} catch (error) {
		return res.status(500).send({ error: "Internal server error" });
	}
}
