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
	disabled,
}) => {
	return (
		<div className="form-control w-full">
			<label className="label px-0">
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
					disabled={disabled}
				/>
			</div>
		</div>
	);
};

export default FormInput;
