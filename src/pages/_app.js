import Head from "next/head";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Layout from "./layout";

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>CRUD</title>
			</Head>
			<Provider store={store}>
				<SessionProvider session={pageProps.session}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</SessionProvider>
			</Provider>
		</>
	);
}

export default MyApp;
