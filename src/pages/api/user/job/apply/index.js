import connectMongo from "@/utils/connectMongo";
import User from "@/models/User";
import Job from "@/models/Job";
import JobApplication from "@/models/JobApplication";
import cloudinary from "cloudinary";

export default async function handler(req, res) {
	try {
		if (req.method !== "PUT") {
			return res
				.status(405)
				.send({ error: `Method ${req.method} not allowed` });
		}

		await connectMongo();

		const { userId, jobId, email, phone, data } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send({ error: "User not found" });
		}

		const job = await Job.findById(jobId);
		if (!job) {
			return res.status(404).send({ error: "Job not found" });
		}

		const result = await cloudinary.v2.uploader.upload(data, {
			folder: "job-networking/resumes",
		});

		if (result.secure_url) {
			const newApplication = new JobApplication({
				job: job._id,
				applicant: user._id,
				email,
				phone,
				resume: result.secure_url,
			});

			const savedApplication = await newApplication.save();

			if (savedApplication) {
				user.jobApplications.push(savedApplication._id);
				job.applications.push(savedApplication._id);

				const updatedUser = await user.save();
				await job.save();

				return res
					.status(201)
					.send({ message: "Application sent.", updatedUser });
			} else {
				return res.status(500).send({ error: "Internal" });
			}
		} else {
			return res.status(404).send({ error: "Missing data" });
		}
	} catch (error) {
		return res.status(500).send({ error: "Internal server error" });
	}
}
