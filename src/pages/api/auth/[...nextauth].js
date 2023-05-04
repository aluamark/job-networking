import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/lib/helper";

export const authOptions = {
	session: {
		strategy: "jwt",
	},
	providers: [
		CredentialsProvider({
			type: "credentials",
			credentials: {},
			async authorize(credentials, req) {
				try {
					const { email, password } = credentials;
					const { user } = await loginUser({ email, password });

					return user;
				} catch (error) {
					throw new Error("Invalid credentials");
				}
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.user = user;
			}

			return token;
		},
		async session({ session, token }) {
			if (token.email) {
				session.user = token.user;
			}

			return session;
		},
	},
};

export default NextAuth(authOptions);
