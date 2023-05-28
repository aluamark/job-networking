import connectMongo from "@/utils/connectMongo";
import User from "@/models/User";

export default async function handler(req, res) {
	try {
		if (req.method !== "GET") {
			return res.status(405).send({ error: "Method not allowed" });
		}

		await connectMongo();

		// Get 3 random users from the "users" collection using Mongoose's aggregate() method
		const users = await User.aggregate([{ $sample: { size: 10 } }]);

		// Return the users as JSON
		return res.status(200).send(users);
	} catch (error) {
		return res.status(500).send({ error: "Internal server error" });
	}
}
