import Link from "next/link";
import Image from "next/image";

export default function Custom404() {
	return (
		<div className="min-h-screen bg-base-100">
			<div className="max-w-screen-sm mx-auto flex flex-col gap-3 items-center py-[4rem]">
				<Image src="/404.gif" alt="404" width={500} height={500} />
				<h2 className="text-3xl font-bold flex gap-1.5">
					<span className="text-error">404</span>- Page Not Found
				</h2>
				<p className="text-center">
					Please check your URL or return to EmployX home.
				</p>
				<Link
					href="/"
					className="flex items-center box-border border border-blue-500 text-blue-500 px-4 py-1 transition duration-150 hover:bg-blue-100 hover:border-2 rounded-full h-10 mt-2 font-semibold"
				>
					Go to EmployX home
				</Link>
			</div>
		</div>
	);
}
