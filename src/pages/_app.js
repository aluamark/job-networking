import Head from "next/head";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./layout";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>EmployX</title>
				<meta name="application-name" content="EmployX" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="EmployX" />
				<meta
					name="description"
					content="EmployX: Unlock endless career opportunities with our innovative job posting website."
				/>
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="theme-color" content="#FFFFFF" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/manifest.json" />
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>
			<QueryClientProvider client={queryClient}>
				<Provider store={store}>
					<SessionProvider session={pageProps.session}>
						<Layout>
							<Component {...pageProps} />
							<ReactQueryDevtools initialIsOpen={false} />
						</Layout>
					</SessionProvider>
				</Provider>
			</QueryClientProvider>
		</>
	);
}

export default MyApp;
