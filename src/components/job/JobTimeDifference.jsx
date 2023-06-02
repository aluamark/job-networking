import React, { useEffect, useState } from "react";
import { getTimeDifference } from "@/lib/helper";

const JobTimeDifference = ({ date }) => {
	const [elapsedSeconds, setElapsedSeconds] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setElapsedSeconds((prevSeconds) => prevSeconds + 1);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);
	return <>{getTimeDifference(date)}</>;
};

export default JobTimeDifference;
