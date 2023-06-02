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
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		resume: {
			type: String,
			required: true,
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
	models.JobApplication || model("JobApplication", jobApplicationSchema);

export default JobApplication;
