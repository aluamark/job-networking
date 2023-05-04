import connectMongo from "@/utils/connectMongo";
import User from "@/models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
	try {
		if (req.method !== "POST") {
			return res.status(405).send({ error: "Method not allowed" });
		}

		await connectMongo();

		const { firstName, lastName, email, password } = req.body;

		if (!email || !password) {
			return res.status(400).send({ error: "Email and password are required" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).send({ error: "Email already registered" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			firstName,
			lastName,
			email,
			password: hashedPassword,
		});
		const savedUser = await newUser.save();

		const savedUserObject = savedUser.toObject();
		delete savedUserObject.password;

		return res
			.status(201)
			.send({ message: "User registered successfully", user: savedUserObject });
	} catch (error) {
		console.error("Error registering user: ", error);
		return res.status(500).send({ error: "Internal server error" });
	}
}
