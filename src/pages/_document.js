import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head />
			<body className="min-h-screen bg-base-100">
				<div id="root">
					<Main />
					<NextScript />
				</div>
			</body>
		</Html>
	);
}
