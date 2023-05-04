import React from "react";
import { useSelector } from "react-redux";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/navbar/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
	const openModal = useSelector((state) => state.openModal);

	return (
		<div className="drawer scroll-smooth">
			<input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col">
				<Navbar />
				<main className="min-h-screen bg-base-200">{children}</main>

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
			<Sidebar />
		</div>
	);
};

export default Layout;
