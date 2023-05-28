import { Schema, models, model } from "mongoose";

const jobSchema = Schema(
	{
		company: {
			type: Schema.Types.ObjectId,
			ref: "Company",
			required: true,
		},
		postedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			default: "",
		},
		country: {
			type: String,
			default: "",
		},
		locationType: {
			type: String,
			default: "",
		},
		employmentType: {
			type: String,
			default: "",
		},
		skills: [String],
		applications: [
			{
				type: Schema.Types.ObjectId,
				ref: "JobApplication",
			},
		],
	},
	{ timestamps: true }
);

const Job = models?.Job || model("Job", jobSchema);

export default Job;
