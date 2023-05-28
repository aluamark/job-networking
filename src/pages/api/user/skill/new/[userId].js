import connectMongo from "@/utils/connectMongo";
import User from "@/models/User";
import mongoose from "mongoose";

export default async function handler(req, res) {
	const { userId } = req.query;

	try {
		if (req.method !== "PUT") {
			return res.status(405).send({ error: "Method not allowed" });
		}

		await connectMongo();

		if (!mongoose.isValidObjectId(userId)) {
			return res.status(400).send({ error: "Invalid user ID" });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send({ error: "User not found" });
		}

		const userNewSkill = req.body;

		if (user.skills.indexOf(userNewSkill) !== -1) {
			return res.status(400).send({ error: "Duplicate skill" });
		}

		if (userNewSkill) {
			user.skills.push(userNewSkill);
			const updatedUser = await user.save();

			return res
				.status(200)
				.send({ message: "Save was successful.", updatedUser });
		} else {
			return res.status(404).send({ error: "Missing data" });
		}
	} catch (error) {
		return res.status(500).send({ error: "Internal server error" });
	}
}
