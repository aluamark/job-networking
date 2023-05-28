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
				<title>CRUD</title>
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
