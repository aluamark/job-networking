import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/navbar/Sidebar";
import BottomNav from "@/components/navbar/BottomNav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/footer/Footer";
import Loading from "@/components/widgets/Loading";

const Layout = ({ children }) => {
	const openModal = useSelector((state) => state.openModal);
	const user = useLoggedUserQuery();

	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const handleStart = () => setIsLoading(true);
		const handleComplete = () => {
			setTimeout(() => {
				setIsLoading(false);
			}, 0);
		};

		router.events.on("routeChangeStart", handleStart);
		router.events.on("routeChangeComplete", handleComplete);
		router.events.on("routeChangeError", handleComplete);

		return () => {
			router.events.off("routeChangeStart", handleStart);
			router.events.off("routeChangeComplete", handleComplete);
			router.events.off("routeChangeError", handleComplete);
		};
	}, [router]);

	return (
		<div className="drawer scroll-smooth">
			<input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col h-screen">
				<Navbar user={user} />
				{/* {isLoading && <Loading />} */}
				{/* className={`bg-base-200 ${isLoading ? "hidden" : "block"}`} */}
				<main>{children}</main>
				<BottomNav user={user} />
				{/* prevent toast from rendering behind the modal if a modal is open */}
				{!openModal && (
					<ToastContainer
						position="bottom-right"
						autoClose={3000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="colored"
					/>
				)}
			</div>
			<Sidebar user={user} />
		</div>
	);
};

export default Layout;
