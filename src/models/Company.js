import { Schema, models, model } from "mongoose";

const companySchema = Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		about: {
			type: String,
			required: true,
			trim: true,
		},
		jobs: [
			{
				type: Schema(
					{
						title: {
							type: String,
							trim: true,
						},
						description: {
							type: String,
						},
					},
					{ timestamps: true }
				),
			},
		],
	},
	{ timestamps: true }
);

const Company = models?.Company || model("Company", companySchema);

export default Company;
