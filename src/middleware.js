export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		"/dashboard",
		"/employee/:path*",
		"/job-posting",
		"/job-posting/:path*",
		"/jobs/collections/recommended",
	],
};
