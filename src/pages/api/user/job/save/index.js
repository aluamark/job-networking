import connectMongo from "@/utils/connectMongo";
import User from "@/models/User";
import Job from "@/models/Job";

export default async function handler(req, res) {
	try {
		if (req.method !== "PUT") {
			return res
				.status(405)
				.send({ error: `Method ${req.method} not allowed` });
		}

		await connectMongo();

		const { userId, jobId } = req.body;
		let message = "";

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send({ error: "User not found" });
		}

		const job = await Job.findById(jobId);
		if (!job) {
			return res.status(404).send({ error: "Job not found" });
		}

		if (user.savedJobs.includes(job._id)) {
			user.savedJobs = user.savedJobs.filter(
				(id) => id.toString() !== jobId.toString()
			);
			message = "This job is no longer saved.";
		} else {
			user.savedJobs.push(job._id);
			message = "You've saved this job.";
		}

		await user.save();

		return res.status(201).send({
			message,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({ error: "Internal server error" });
	}
}
