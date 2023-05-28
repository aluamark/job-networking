import { Schema, models, model } from "mongoose";

const jobApplicationSchema = Schema(
	{
		job: {
			type: Schema.Types.ObjectId,
			ref: "Job",
		},
		applicant: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		resume: {
			type: String,
			required: true,
		},
		coverLetter: {
			type: String,
			default: "",
		},
		status: {
			type: String,
			enum: ["pending", "viewed", "rejected", "accepted"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

const JobApplication =
	models.Job || model("JobApplication", jobApplicationSchema);

export default JobApplication;
