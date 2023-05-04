import connectMongo from "@/utils/connectMongo";
import User from "@/models/User";

export default async function handler(req, res) {
	const { email } = req.query;

	try {
		if (req.method !== "GET") {
			return res.status(405).send({ error: "Method not allowed" });
		}

		await connectMongo();

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).send({ error: "No user found" });
		}

		res.status(200).send(user);
	} catch (error) {
		console.error("Error logging in user: ", error);
		return res.status(500).send({ error: "Internal server error" });
	}
}
