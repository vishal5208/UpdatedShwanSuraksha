import React, { useState } from "react";
import { calculatePremium } from "../backendConnectors/PremiumCalculatorConnector";
import { addPolicy } from "../backendConnectors/shwanSurkshaConnector";

const QuoteForm = () => {
	const [breed, setBreed] = useState("");
	const [age, setAge] = useState("");
	const [region, setRegion] = useState("");
	const [healthCondition, setHealthCondition] = useState("");
	const [policyType, setPolicyType] = useState("");
	const [showPolicyPrice, setShowPolicyPrice] = useState(false);
	const [premium, setPremium] = useState(0);
	const [isLoding, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [policyId, setPolicyId] = useState("");
	const [petDetails, setPetDetails] = useState({
		breed: "",
		age: "",
		region: "",
		healthCondition: "",
		policyType: "",
	});

	const handleSubmit = async (event) => {
		event.preventDefault();

		const petDetailsData = {
			breed: breed,
			age: age,
			region: region,
			healthCondition: healthCondition,
			policyType: policyType,
		};

		const data = await calculatePremium(petDetailsData);

		if (data.success) {
			setPremium(data.data);
			// Show the policy price
			setShowPolicyPrice(true);
		}

		// Reset form values
		setBreed("");
		setAge("");
		setRegion("");
		setHealthCondition("");
		setPolicyType("");

		// Set petDetails state using the existing state variable
		setPetDetails((prevState) => ({
			...prevState,
			...petDetailsData,
		}));
	};

	const handleAddPolicy = async () => {
		setIsLoading(true);
		setErrorMsg("");

		console.log("petDetails : ", petDetails);

		const policyResult = await addPolicy(petDetails);
		setIsLoading(false);

		if (policyResult.success) {
			setPolicyId(policyResult.policyId);
		}
	};

	const handleCopyBatchId = () => {
		navigator.clipboard.writeText(policyId);
		alert("Batch ID copied to clipboard!");
	};

	return (
		<section className="flex justify-center items-center w-6/7 mx-auto space-x-9">
			<div className="flex flex-col flex-wrap sm:space-y-7  w-1/4  font-GeneralSans p-4 my-4 border-2 border-gradient border-black rounded-lg">
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

			{showPolicyPrice && (
				<div className="flex flex-col justify-center items-center space-x-4 space-y-5">
					<div className="bg-[#c5bbd4] p-4 rounded-lg flex justify-center items-center flex-col space-y-4">
						<p className="font-semibold text-2xl text-black mb-4 leading-10">
							Your Pet's Premium is{" "}
							<span className=" text-green-600">${premium}</span>.
						</p>
						<button
							onClick={handleAddPolicy}
							disabled={isLoding}
							className="uppercase text-white sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l  from-black to-purple-800 sm:py-2 "
						>
							{isLoding ? "Adding Policy..." : "Add Policy"}
						</button>
					</div>
					{policyId && (
						<div className="flex gap-4 self-center items-center justify-center">
							<span className="text-green-500 text-lg font-semibold">
								POLICY ID: {policyId}
							</span>
							<button
								className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium"
								onClick={handleCopyBatchId}
							>
								Copy
							</button>
						</div>
					)}
				</div>
			)}
		</section>
	);
};

export default QuoteForm;
