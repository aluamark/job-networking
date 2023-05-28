import cloudinary from "cloudinary";
import connectMongo from "@/utils/connectMongo";
import User from "@/models/User";
import mongoose from "mongoose";

export default async function handler(req, res) {
	try {
		if (req.method !== "POST") {
			return res.status(405).send({ error: "Method not allowed" });
		}

		await connectMongo();

		const { userId, data } = req.body;

		if (!mongoose.isValidObjectId(userId)) {
			return res.status(400).send({ error: "Invalid user ID" });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send({ error: "User not found" });
		}

		const result = await cloudinary.v2.uploader.upload(data, {
			folder: "job-networking",
		});

		if (result.secure_url) {
			user.set("picturePath", result.secure_url);
			const updatedUser = await user.save();

			return res
				.status(200)
				.send({ message: "Upload was successful.", updatedUser });
		} else {
			return res.status(404).send({ error: "Missing data" });
		}
	} catch (error) {
		return res.status(500).json({ error: "Something went wrong" });
	}
}
