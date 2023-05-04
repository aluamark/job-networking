import { Schema, model, models } from "mongoose";

const userSchema = Schema(
	{
		employer: {
			type: Boolean,
			required: true,
			default: false,
			select: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			select: true,
			validate(value) {
				if (!/^\S+@\S+\.\S+$/.test(value)) {
					throw new Error("Please enter a valid email address.");
				}
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
			select: false,
			validate(value) {
				if (value.toLowerCase().includes("password")) {
					throw new Error("Password must not contain the word 'password.'");
				}
			},
		},
		firstName: {
			type: String,
			required: true,
			trim: true,
			select: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
			select: true,
		},
		additionalName: {
			type: String,
			default: "",
			select: true,
		},
		pronoun: {
			type: String,
			default: "",
			select: true,
		},
		headline: {
			type: String,
			default: "",
			select: true,
		},
		contact: {
			type: String,
			default: "",
			select: true,
		},
		country: {
			type: String,
			default: "",
			select: true,
		},
		city: {
			type: String,
			default: "",
			select: true,
		},
		skills: {
			type: [String],
			select: true,
		},
		educations: [
			{
				degree: {
					type: String,
					required: true,
					select: true,
				},
				school: {
					type: String,
					required: true,
					select: true,
				},
				startYear: {
					type: Number,
					required: true,
					select: true,
				},
				endYear: {
					type: Number,
					required: true,
					select: true,
				},
			},
		],
		experiences: [
			{
				title: {
					type: String,
					required: true,
					select: true,
				},
				company: {
					type: String,
					required: true,
					select: true,
				},
				location: {
					type: String,
					required: true,
					select: true,
				},
				startDate: {
					type: Date,
					required: true,
					select: true,
				},
				endDate: {
					type: Date,
					select: true,
				},
				description: {
					type: String,
					select: true,
				},
			},
		],
		connections: {
			type: [Schema.Types.ObjectId],
			ref: "User",
			select: true,
		},
		picturePath: {
			type: String,
			default: "",
			select: true,
		},
	},
	{ timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
