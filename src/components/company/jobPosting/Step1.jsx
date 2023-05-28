import React from "react";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";

const Step1 = ({
	companyName,
	formData,
	formErrors,
	handleChange,
	nextStep,
	locationTypeOptions,
	employmentTypeOptions,
}) => {
	return (
		<div className="flex justify-center items-center h-[48rem] pt-16 bg-slate-700">
			<div className="flex flex-col gap-2 w-96 bg-base-100 rounded-lg p-5">
				<div className="flex flex-col">
					<span className="text-xl font-semibold">Find a great hire, fast</span>
					<span className="text-sm">
						Rated #1 in increasing quality of hire.
					</span>
				</div>

				<div className="flex flex-col">
					<FormInput
						name="title"
						size="sm"
						title="Job title*"
						type="text"
						placeholder="Add the title you are hiring for"
						value={formData?.title}
						onChange={handleChange}
						error={formErrors.title}
					/>
					<FormInput
						name="companyName"
						size="sm"
						title="Company"
						type="text"
						value={companyName}
						onChange={handleChange}
						error={formErrors.companyName}
						disabled
					/>
					<FormSelect
						name="locationType"
						size="sm"
						title="Workplace Type"
						options={locationTypeOptions}
						onChange={handleChange}
						error={formErrors.location}
					/>
					<FormInput
						name="city"
						size="sm"
						title="City*"
						type="text"
						value={formData?.city}
						onChange={handleChange}
						error={formErrors.city}
					/>
					<FormInput
						name="country"
						size="sm"
						title="Country"
						type="text"
						value={formData?.country}
						onChange={handleChange}
						error={formErrors.country}
					/>
					<FormSelect
						name="employmentType"
						size="sm"
						title="Job Type"
						options={employmentTypeOptions}
						onChange={handleChange}
						error={formErrors.location}
					/>
				</div>
				<div className="pt-3">
					<button
						onClick={nextStep}
						className="bg-blue-600 w-full rounded-full py-2.5 my-2 text-xl text-white font-semibold"
					>
						Get started
					</button>
				</div>
			</div>
		</div>
	);
};

export default Step1;
