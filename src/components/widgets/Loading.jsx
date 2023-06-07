import React from "react";
import Image from "next/image";

const Loading = () => {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center gap-10">
			<span className="text-5xl font-extrabold text-blue-600">EmployX</span>
			<Image
				src="/employx.png"
				width={72}
				height={72}
				alt="spinning-logo"
				className="animate-spin"
			/>
		</div>
	);
};

export default Loading;
