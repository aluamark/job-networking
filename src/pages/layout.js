import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useLoggedUserQuery } from "@/lib/react-query-hooks/useLoggedUserQuery";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/navbar/Sidebar";
import BottomNav from "@/components/navbar/BottomNav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/footer/Footer";

const Layout = ({ children }) => {
	const openModal = useSelector((state) => state.openModal);
	const user = useLoggedUserQuery();

	const router = useRouter();
	const showNavbar = router.asPath !== "/";
	const showBottomNav =
		router.asPath !== "/" &&
		!router.asPath.startsWith("/login") &&
		router.asPath !== "/signup";

	return (
		<div className="drawer scroll-smooth">
			<input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col h-screen">
				{showNavbar && <Navbar user={user} />}
				<main>{children}</main>
				{showBottomNav && <BottomNav user={user} />}
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
						theme="light"
					/>
				)}
			</div>
			<Sidebar user={user} />
		</div>
	);
};

export default Layout;
