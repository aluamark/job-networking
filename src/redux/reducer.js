import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	openModal: false,
	user: null,
	tableData: { employees: [] },
};

export const reducerSlice = createSlice({
	name: "emsSlice",
	initialState,
	reducers: {
		resetState: (state) => {
			state = initialState;
		},
		setOpenModal: (state, action) => {
			state.openModal = action.payload;
		},
		setLoggedUser: (state, action) => {
			state.user = action.payload;
		},
		setSearch: (state, action) => {
			state.tableData.employees = state.tableData.employees.filter(
				(employee) => {
					const employeeName = `${employee.firstName.toLowerCase()} ${employee.lastName.toLowerCase()}`;

					return employeeName.includes(action.payload);
				}
			);
		},
		setTableData: (state, action) => {
			state.tableData.employees = action.payload;
		},
		setCreateEmployee: (state, action) => {
			state.tableData.employees = [
				...state.tableData.employees,
				action.payload,
			];
		},
		setDeleteEmployee: (state, action) => {
			state.tableData.employees = state.tableData.employees.filter(
				(employee) => employee._id !== action.payload
			);
		},
	},
});

export const {
	resetState,
	setOpenModal,
	setLoggedUser,
	setSearch,
	setTableData,
	setCreateEmployee,
	setDeleteEmployee,
} = reducerSlice.actions;

export default reducerSlice.reducer;
