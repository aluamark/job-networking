import { Schema, model, models } from "mongoose";

const employeeSchema = new Schema(
	{
		firstName: String,
		lastName: String,
		email: {
			type: String,
			required: true,
			unique: true,
		},
		location: String,
	},
	{ timestamps: true }
);

const Employee = models?.Employee || model("Employee", employeeSchema);

export default Employee;
