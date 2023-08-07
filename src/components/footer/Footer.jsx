import React from "react";

const Footer = () => {
	return (
		<footer className="max-w-screen-xl flex flex-col gap-5 mx-auto py-10 text-xs">
			<p>
				This website may resemble LinkedIn in design as I have used some of its
				design elements for the purpose of showcasing my web development skills
				in my portfolio. This website is not intended for commercial use or to
				infringe on any copyright or trademark of LinkedIn.
			</p>
			<div className="flex flex-col gap-1">
				<span>Github repo:</span>

				<a
					href="https://github.com/aluamark/job-networking"
					target="blank"
					className="link link-hover text-blue-600"
				>
					https://github.com/aluamark/job-networking
				</a>
				<span>Portfolio site:</span>

				<a
					href="https://aluamark.vercel.app"
					target="blank"
					className="link link-hover text-blue-600"
				>
					https://aluamark.vercel.app
				</a>
			</div>
		</footer>
	);
};

export default Footer;
