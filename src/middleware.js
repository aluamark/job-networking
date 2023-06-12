export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		"/company/setup/new",
		"/hiring/:path*",
		"/my-items/:path*",
		"/job-posting/:path*",
		"/jobs/collections/recommended",
		"/api/application/:path*",
		"/api/company/new",
		"/api/company/photo/upload",
		"/api/company/validate/:path*",
		"/api/job/new",
		"/api/user/job/:path*",
		"/api/user/photo/upload",
		"/api/user/position/:path*",
		"/api/user/skill/:path*",
		"/api/user/update/:path*",
	],
};
