import React from "react";

const FormInput = ({
	name,
	title,
	type,
	placeholder,
	defaultValue,
	value,
	onChange,
	error,
	autoFocus,
	size,
}) => {
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
				<input
					name={name}
					type={type}
					placeholder={placeholder}
					className={`input input-bordered w-full ${
						size ? `btn-${size}` : null
					}`}
					onChange={onChange}
					value={value}
					defaultValue={defaultValue}
					autoFocus={autoFocus}
				/>
			</div>
		</div>
	);
};

export default FormInput;
