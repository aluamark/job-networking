import React from "react";

const FormSelect = ({ name, title, options, onChange, error, size }) => {
	return (
		<div className="form-control w-full">
			<label className="label">
				<span className="label-text">{title}</span>
			</label>
			<div
				className={`${
					error ? "tooltip tooltip-error tooltip-open tooltip-top" : null
				}`}
				data-tip={error}
			>
				<select
					name={name}
					onChange={onChange}
					className={`select select-bordered w-full ${
						size ? `select-${size}` : null
					} font-normal`}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default FormSelect;
