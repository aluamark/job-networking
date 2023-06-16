import React from "react";

const Checkbox = ({ label, checked, onChange }) => {
	return (
		<div className="form-control">
			<label className="label cursor-pointer">
				<span className="label-text">{label}</span>
				<input
					type="checkbox"
					checked={checked}
					onChange={onChange}
					className="checkbox"
				/>
			</label>
		</div>
	);
};

export default Checkbox;
