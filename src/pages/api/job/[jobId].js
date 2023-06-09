import connectMongo from "@/utils/connectMongo";
import Job from "@/models/Job";
import JobApplication from "@/models/JobApplication";
import Company from "@/models/Company";
import User from "@/models/User";
import mongoose from "mongoose";

export default async function first(req, res) {
	const { jobId } = req.query;

	switch (req.method) {
		case "GET":
			try {
				await connectMongo();
				if (!mongoose.isValidObjectId(jobId)) {
					res.status(400).send({ error: "Invalid job ID" });
				}

				const job = await Job.findById(jobId)
					.populate({
						path: "postedBy",
						select:
							"-additionalName -adminPages -adminRequests -city -connections -contact -country -educations -experiences -jobApplications -postedJobs -pronoun -savedJobs -searchHistory -skills -createdAt -updatedAt",
					})
					.populate({
						path: "applications",
						populate: {
							path: "applicant",
						},
					})
					.populate({
						path: "company",
						select: "picturePath name uniqueAddress city country",
					});

				if (!job) {
					res.status(404).send({ error: "Job not found" });
				}

				res.status(200).send(job);
			} catch (error) {
				res.status(500).send({ error: "Internal server error" });
			}
			break;

		case "PUT":
			try {
				if (!mongoose.isValidObjectId(jobId)) {
					res.status(400).send({ error: "Invalid job ID" });
				}

				const job = await Job.findById(jobId);
				if (!job) {
					res.status(404).send({ error: "Job posting not found" });
				}

				const jobData = req.body;
				if (jobData) {
					job.set(req.body);
					const updatedJob = await job.save();

					res.status(200).send({ message: "Save was successful.", updatedJob });
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
