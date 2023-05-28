import { Schema, models, model } from "mongoose";

const companySchema = Schema(
	{
		uniqueAddress: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		tagline: {
			type: String,
			default: "",
		},
		about: {
			type: String,
			default: "",
		},
		industry: {
			type: String,
			default: "",
		},
		city: {
			type: String,
			default: "",
		},
		country: {
			type: String,
			default: "",
		},
		founded: {
			type: String,
			default: "",
		},
		website: {
			type: String,
			default: "",
		},
		picturePath: {
			type: String,
			default: "",
		},
		specialties: {
			type: [String],
		},
		followers: {
			type: Number,
			default: 0,
		},
		admins: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		requests: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		jobs: [
			{
				type: Schema.Types.ObjectId,
				ref: "Job",
			},
		],
	},
	{ timestamps: true }
);

const Company = models?.Company || model("Company", companySchema);

export default Company;
