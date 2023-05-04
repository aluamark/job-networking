import connectMongo from "@/utils/connectMongo";
import User from "@/models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
	try {
		if (req.method !== "POST") {
			return res.status(405).send({ error: "Method not allowed" });
		}

		await connectMongo();

		const { email, password } = req.body;

		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return res.status(404).send({ error: "No user found" });
		}

		console.log(user);

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).send({ error: "Invalid credentials" });
		}

		const userObject = user.toObject();
		delete userObject.password;

		res
			.status(200)
			.send({ message: "Logged in successfully", user: userObject });
	} catch (error) {
		console.error("Error logging in user: ", error);
		return res.status(500).send({ error: "Internal server error" });
	}
}
