import mongoose from "mongoose";

const connectMongo = async () =>
	await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

export default connectMongo;
