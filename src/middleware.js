export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		"/dashboard",
		"/employee/:path*",
		"/my-items/saved-jobs",
		"/job-posting",
		"/job-posting/:path*",
		"/jobs/collections/recommended",
	],
};
