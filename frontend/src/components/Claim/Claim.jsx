import { useState } from "react";

const Claim = () => {
	const [breed, setBreed] = useState("");
	const [age, setAge] = useState("");
	const [region, setRegion] = useState("");
	const [healthCondition, setHealthCondition] = useState("");
	const [policyType, setPolicyType] = useState("");
	const [showPolicyPrice, setShowPolicyPrice] = useState(false);

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

		// Show the policy price
		setShowPolicyPrice(true);

		// Reset form values
		setBreed("");
		setAge("");
		setRegion("");
		setHealthCondition("");
		setPolicyType("");
	};

	return (
		<section className="flex flex-col justify-center items-center w-3/4 mx-auto space-x-9">
			<div className="flex flex-col flex-wrap sm:space-y-7  w-1/3  font-GeneralSans p-4 my-4 border-2 border-gradient border-black rounded-lg">
				<p className="text-center sm:text-4xl  text-2xl font-bold font-spaceGrotesk py-4">
					Get policy details.
				</p>
				<form onSubmit={handleSubmit}>
					<div className="grid sm:grid-cols-4 sm:gap-6 gap-3">
						{/* Age in months */}
						<div className="col-span-full flex flex-col space-y-2  justify-center">
							<label
								htmlFor="age"
								className="font-semibold sm:text-xl font-spaceGrotesk uppercase"
							>
								Policy ID
							</label>
							<input
								id="age"
								type="text"
								className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg sm:p-4 p-2 sm:w-full"
								placeholder="Enter here"
								value={age}
								onChange={(event) => setAge(event.target.value)}
							></input>
						</div>

						<div className="sm:col-start-2 sm:col-span-2 ">
							<button
								type="submit"
								className="text-white sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l  from-black to-purple-800 sm:py-2 sm:w-full"
							>
								Get Policy
							</button>
						</div>
					</div>
				</form>
			</div>

			{showPolicyPrice && (
				<div className="w-1/3 bg-[#c5bbd4] p-4 rounded-lg flex justify-center items-center flex-col">
					<p className="font-semibold text-2xl text-red-600 mb-4 leading-10">
						Your Pet's Premium is $419.265 dollars.
					</p>
					<button className="uppercase text-white sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l  from-black to-purple-800 sm:py-2 ">
						Add Policy
					</button>
				</div>
			)}
		</section>
	);
};

export default Claim;
