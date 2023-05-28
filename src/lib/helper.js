import axios from "axios";
import DOMPurify from "dompurify";

const BASE_URL = "http://localhost:3000";

// SEARCH
export const search = async (keywords) => {
	const response = await axios.get(`${BASE_URL}/api/search/${keywords}`);
	return response.data;
};

// CREATE USER
export const createUser = async (userData) => {
	const response = await axios.post(`${BASE_URL}/api/user/signup`, userData, {
		headers: { "Content-Type": "application/json" },
	});
	const user = response.data;

	return user;
};

// LOGIN USER
export const loginUser = async (credentials) => {
	const response = await axios.post(`${BASE_URL}/api/user/login`, credentials, {
		headers: { "Content-Type": "application/json" },
	});
	const user = response.data;

	return user;
};

// GET USER
export const getUser = async (email) => {
	const response = await axios.get(`${BASE_URL}/api/user/${email}`);
	const user = response.data;

	return user;
};

// GET RANDOM USERS
export const getRandomUsers = async () => {
	const response = await axios.get(`${BASE_URL}/api/users/random`);
	const users = response.data;

	return users;
};

// UPDATE USER
export const updateUser = async ({ userId, userData }) => {
	return await axios.put(`${BASE_URL}/api/user/update/${userId}`, userData, {
		headers: { "Content-Type": "application/json" },
	});
};

// UPDATE USER PICTURE
export const updateUserPicture = async ({ data, userId }) => {
	return await fetch("/api/user/photo/upload", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ data, userId }),
	});
};

// ADD NEW EXPERIENCE
export const addUserExperience = async ({ userId, userExperience }) => {
	const response = await axios.put(
		`${BASE_URL}/api/user/position/new/${userId}`,
		userExperience,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	const updatedUser = response.data;

	return updatedUser;
};

// ADD NEW SKILL
export const addUserSkill = async ({ userId, userSkill }) => {
	return await axios.put(
		`${BASE_URL}/api/user/skill/new/${userId}`,
		userSkill,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
};

// REORDER EXPERIENCES
export const reorderUserExperiences = async ({
	userId,
	reorderedExperiences,
}) => {
	const response = await axios.put(
		`${BASE_URL}/api/user/position/reorder/${userId}`,
		reorderedExperiences,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	const updatedUser = response.data;

	return updatedUser;
};

// REORDER SKILLS
export const reorderUserSkills = async ({ userId, reorderedSkills }) => {
	const response = await axios.put(
		`${BASE_URL}/api/user/skill/reorder/${userId}`,
		reorderedSkills,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	const updatedUser = response.data;

	return updatedUser;
};

// SAVE JOB
export const saveJob = async ({ userId, jobId }) => {
	return await axios.put(
		`${BASE_URL}/api/user/job/save`,
		{ userId, jobId },
		{
			headers: { "Content-Type": "application/json" },
		}
	);
};

// SEARCH COMPANY
export const validateUniqueAddress = async (uniqueAddress) => {
	const response = await axios.get(
		`${BASE_URL}/api/company/validate/${uniqueAddress.trim()}`
	);
	const unique = response.data;

	return unique;
};

// CREATE COMPANY
export const createCompany = async (companyData) => {
	const response = await axios.post(
		`${BASE_URL}/api/company/new`,
		companyData,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	const company = response.data;

	return company;
};

// GET COMPANY
export const getCompany = async (uniqueAddress) => {
	const response = await axios.get(`${BASE_URL}/api/company/${uniqueAddress}`);
	const company = response.data;

	return company;
};

// UPDATE COMPANY
export const updateCompany = async ({ uniqueAddress, companyData }) => {
	return await axios.put(
		`${BASE_URL}/api/company/${uniqueAddress}`,
		companyData,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
};

// UPDATE COMPANY PICTURE
export const updateCompanyPicture = async ({ data, companyId }) => {
	return await fetch("/api/company/photo/upload", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ data, companyId }),
	});
};

// GET COMPANY JOBS
export const getCompanyJobs = async (companyId) => {
	const response = await axios.get(`/api/jobs/${companyId}`);
	const jobs = response.data;

	return jobs;
};

// CREATE JOB
export const createJob = async (jobData) => {
	const response = await axios.post("/api/job/new", jobData, {
		headers: { "Content-Type": "application/json" },
	});
	const job = response.data;

	return job;
};

// GET JOB
export const getJob = async (jobId) => {
	const response = await axios.get(`/api/job/${jobId}`, {
		headers: { "Content-Type": "application/json" },
	});
	const job = response.data;

	return job;
};

// GET JOBS
export const getJobs = async () => {
	const response = await axios.get("/api/jobs");
	const jobs = response.data;

	return jobs;
};

// Function to get recommended jobs for a user
export const getRecommendedJobs = (userProfile, jobListings) => {
	// Function to calculate similarity between user profile and job listings
	const calculateSimilarity = (userProfile, jobListing) => {
		const userSkills = userProfile.skills;
		const jobSkills = jobListing.skills;

		// Calculate the Jaccard similarity coefficient
		const intersection = userSkills.filter((skill) =>
			jobSkills.includes(skill)
		);
		const union = [...new Set([...userSkills, ...jobSkills])];
		const similarity = intersection.length / union.length;

		return similarity;
	};

	// Calculate similarity scores for each job listing
	const recommendedJobs = jobListings.map((jobListing) => {
		const similarity = calculateSimilarity(userProfile, jobListing);
		return { jobListing, similarity };
	});

	// Filter out jobs with no similarity
	const filteredJobs = recommendedJobs.filter(
		(recommendedJob) => recommendedJob.similarity > 0
	);

	// Sort recommended jobs based on similarity scores (descending order)
	filteredJobs.sort((a, b) => b.similarity - a.similarity);

	// Return the sorted recommended jobs
	return filteredJobs.map((recommendedJob) => recommendedJob.jobListing);
};

export const getTimeDifference = (postedAt) => {
	const postTime = new Date(postedAt);
	const currentTime = new Date();

	const timeDifference = Math.abs(currentTime - postTime);

	const secondsDifference = Math.floor(timeDifference / 1000);
	const minutesDifference = Math.floor(timeDifference / (1000 * 60));
	const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
	const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	const monthsDifference = Math.floor(
		timeDifference / (1000 * 60 * 60 * 24 * 30)
	);

	if (monthsDifference >= 1) {
		return `${monthsDifference} ${
			monthsDifference === 1 ? "month" : "months"
		} ago`;
	} else if (daysDifference >= 1) {
		return `${daysDifference} ${daysDifference === 1 ? "day" : "days"} ago`;
	} else if (hoursDifference >= 1) {
		return `${hoursDifference} ${hoursDifference === 1 ? "hour" : "hours"} ago`;
	} else if (minutesDifference >= 1) {
		return `${minutesDifference} ${
			minutesDifference === 1 ? "minute" : "minutes"
		} ago`;
	} else {
		return `${secondsDifference} ${
			secondsDifference === 1 ? "second" : "seconds"
		} ago`;
	}
};

// SANITIZE COMPANY DESCRIPTION
export const renderDescription = (description) => {
	const sanitizedDescription = DOMPurify.sanitize(description);
	const descriptionWithBullets = sanitizedDescription.replace(
		/<li>/g,
		"<li class='pl-5'>&bull; "
	);

	return (
		<div
			dangerouslySetInnerHTML={{ __html: descriptionWithBullets }}
			className="text-inherit"
		/>
	);
};

// GET EMPLOYEE
export const getEmployees = async () => {
	const response = await axios.get(`${BASE_URL}/api/employees`);
	const employees = response.data;

	return employees;
};

export const getEmployee = async (id) => {
	const response = await axios.get(`${BASE_URL}/api/employee/${id}`);
	const employee = response.data;

	return employee;
};

// CREATE EMPLOYEE
export const createEmployee = async (employeeData) => {
	const response = await axios.post(
		`${BASE_URL}/api/employee/create`,
		employeeData,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	const { employee } = response.data;

	return employee;
};

// UPDATE EMPLOYEE
export const updateEmployee = async (employeeId, employeeData) => {
	const response = await axios.put(
		`${BASE_URL}/api/employee/update/${employeeId}`,
		employeeData,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	const updatedEmployee = response.data;

	return updatedEmployee;
};

// DELETE EMPLOYEE
export const deleteEmployee = async (id) => {
	const response = await axios.delete(`${BASE_URL}/api/employee/delete/${id}`);
	const message = response.data;

	return message;
};
