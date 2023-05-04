import axios from "axios";

const BASE_URL = "http://localhost:3000";

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
export const updateUser = async (userId, userData) => {
	const response = await axios.put(
		`${BASE_URL}/api/user/update/${userId}`,
		userData,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	const updatedUser = response.data;

	return updatedUser;
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
