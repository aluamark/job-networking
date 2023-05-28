import cloudinary from "cloudinary";
import connectMongo from "@/utils/connectMongo";
import Company from "@/models/Company";
import mongoose from "mongoose";

export default async function handler(req, res) {
	try {
		if (req.method !== "POST") {
			return res.status(405).send({ error: "Method not allowed" });
		}

		await connectMongo();

		const { companyId, data } = req.body;

		if (!mongoose.isValidObjectId(companyId)) {
			return res.status(400).send({ error: "Invalid user ID" });
		}

		const company = await Company.findById(companyId);
		if (!company) {
			return res.status(404).send({ error: "Company not found" });
		}

		const result = await cloudinary.v2.uploader.upload(data, {
			folder: "job-networking",
		});

		if (result.secure_url) {
			company.set("picturePath", result.secure_url);
			const updatedCompany = await company.save();

			return res
				.status(200)
				.send({ message: "Upload was successful.", updatedCompany });
		} else {
			return res.status(404).send({ error: "Missing data" });
		}
	} catch (error) {
		return res.status(500).json({ error: "Something went wrong" });
	}
}
