import connectMongo from "@/utils/connectMongo";
import JobApplication from "@/models/JobApplication";

export default async function handler(req, res) {
	const { applicationId } = req.query;
	try {
		if (req.method !== "PUT") {
			return res
				.status(405)
				.send({ error: `Method ${req.method} not allowed` });
		}

		await connectMongo();

		const application = await JobApplication.findById(applicationId);
		if (!application) {
			return res.status(404).send({ error: "Application not found" });
		}

		application.status = "downloaded";

		const updatedApplication = await application.save();

		return res.status(201).send({
			message: "Viewed resume.",
			updatedApplication,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send({ error: "Internal server error" });
	}
}
