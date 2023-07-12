import React, { useState } from "react";

const QuoteForm = () => {
	const [breed, setBreed] = useState("");
	const [age, setAge] = useState("");
	const [region, setRegion] = useState("");
	const [healthCondition, setHealthCondition] = useState("");
	const [policyType, setPolicyType] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();

		// Perform actions with the form data here
		console.log("Form data:", {
			breed,
			age,
			region,
			healthCondition,
			policyType,
		});

		// Reset form values
		setBreed("");
		setAge("");
		setRegion("");
		setHealthCondition("");
		setPolicyType("");
	};

	return (
		<div className="flex flex-col flex-wrap sm:space-y-7 sm:w-1/4 w-full mx-auto font-GeneralSans p-4 my-4 border-2 border-gradient border-black rounded-lg">
			<p className="text-center sm:text-4xl  text-2xl font-bold font-spaceGrotesk py-4">
				Tell us about your pet.
			</p>
			<form onSubmit={handleSubmit}>
				<div className="grid sm:grid-cols-4 sm:gap-6 gap-3">
					{/* Breed */}
					<div className="col-span-full flex flex-col space-y-2 justify-center">
						<label
							htmlFor="breed"
							className="font-semibold sm:text-xl font-spaceGrotesk"
						>
							Breed of your pet:
						</label>
						<select
							id="breed"
							className="bg-[#1A0142] text-white uppercase border border-solid border-[#B1B1B1] rounded-lg sm:text-lg sm:p-4 p-2 sm:w-full"
							value={breed}
							onChange={(event) => setBreed(event.target.value)}
						>
							<option value="">Select a breed</option>
							<option value="Labrador Retriever">Labrador Retriever</option>
							<option value="German Shepherd">German Shepherd</option>
							<option value="Golden Retriever">Golden Retriever</option>
							<option value="OTHERS">OTHERS</option>
						</select>
					</div>

					{/* Age in months */}
					<div className="col-span-full flex flex-col space-y-2  justify-center">
						<label
							htmlFor="age"
							className="font-semibold sm:text-xl font-spaceGrotesk"
						>
							Age of your pet:
						</label>
						<input
							id="age"
							type="text"
							pattern="\d*"
							onInput={(event) => {
								event.target.value = event.target.value.replace(/\D/g, "");
							}}
							className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg sm:p-4 p-2 sm:w-full"
							placeholder="Age in months"
							value={age}
							onChange={(event) => setAge(event.target.value)}
						></input>
					</div>

					{/* Region */}
					<div className="col-span-full flex flex-col space-y-2 justify-center">
						<label
							htmlFor="region"
							className="font-semibold sm:text-xl font-spaceGrotesk"
						>
							Region where your pet resides:
						</label>
						<select
							id="region"
							className="bg-[#1A0142] text-white  uppercase border border-solid border-[#B1B1B1] rounded-lg sm:text-lg sm:p-4 p-2 sm:w-full"
							value={region}
							onChange={(event) => setRegion(event.target.value)}
						>
							<option value="">Select a region</option>
							<option value="North">North</option>
							<option value="South">South</option>
							<option value="East">East</option>
							<option value="West">West</option>
							<option value="OTHERS">OTHERS</option>
						</select>
					</div>

					{/* Health condition */}
					<div className="col-span-full flex flex-col space-y-2 justify-center">
						<label
							htmlFor="health"
							className="font-semibold sm:text-xl font-spaceGrotesk"
						>
							Health condition of your pet:
						</label>
						<select
							id="health"
							className="bg-[#1A0142] text-white  uppercase border border-solid border-[#B1B1B1] rounded-lg sm:text-lg sm:p-4 p-2 sm:w-full"
							value={healthCondition}
							onChange={(event) => setHealthCondition(event.target.value)}
						>
							<option value="">Select health condition</option>
							<option value="Mild">Mild</option>
							<option value="Moderate">Moderate</option>
							<option value="Severe">Severe</option>
							<option value="OTHERS">OTHERS</option>
						</select>
					</div>

					{/* Type of policy */}
					<div className="col-span-full flex flex-col space-y-2 justify-center">
						<label
							htmlFor="policyType"
							className="font-semibold sm:text-xl font-spaceGrotesk"
						>
							Type of insurance policy desired:
						</label>
						<select
							id="policyType"
							className="bg-[#1A0142] text-white  uppercase border border-solid border-[#B1B1B1] rounded-lg sm:text-lg sm:p-4 p-2 sm:w-full"
							value={policyType}
							onChange={(event) => setPolicyType(event.target.value)}
						>
							<option value="">Select policy type</option>
							<option value="Basic">Basic</option>
							<option value="Premium">Premium</option>
							<option value="OTHERS">OTHERS</option>
						</select>
					</div>

					<div className="sm:col-start-2 sm:col-span-2 ">
						<button
							type="submit"
							className="text-white sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l  from-black to-purple-800 sm:py-2 sm:w-full"
						>
							SUBMIT
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default QuoteForm;
