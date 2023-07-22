import { useState } from "react";
import { requestClaim } from "../backendConnectors/claimShwanSurakshaConnector";

const RequestClaimForm = () => {
	const [policyId, setPolicyId] = useState("");
	const [claimDetails, setClaimDetails] = useState({
		dateAndTime: "",
		location: "",
		description: "",
		isAccident: false,
		otherPartiesInvolved: [],
	});
	const [veterinaryInfo, setVeterinaryInfo] = useState({
		veterinarianName: "",
		contactDetails: "",
		clinicOrHospitalName: "",
		visitDates: [],
		diagnosis: "",
		treatmentProvided: "",
	});
	const [supportingDocs, setSupportingDocs] = useState([]);
	const [claimAmount, setClaimAmount] = useState({
		totalAmount: 0,
		breakdownOfExpenses: "",
		deductible: 0,
		limit: 0,
	});
	const [declaration, setDeclaration] = useState({
		isAccurateAndTruthful: false,
		signature: "",
	});

	// Function to handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		const result = await requestClaim({
			policyId,
			claimDetails,
			veterinaryInfo,
			supportingDocs,
			claimAmount,
			declaration,
		});
	};

	// Function to handle changes in the supportingDocs input
	const handleSupportingDocsChange = (e) => {
		setSupportingDocs(e.target.value.split(","));
	};
    
	return (
		<div>
			<h1>Claim Policy Request Form</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="policyId">Policy ID: </label>
					<input
						type="text"
						id="policyId"
						value={policyId}
						onChange={(e) => setPolicyId(e.target.value)}
						required
					/>
				</div>
				<div>
					<h2>Claim Details</h2>
					<label htmlFor="dateAndTime">Date and Time: </label>
					<input
						type="datetime-local"
						id="dateAndTime"
						value={claimDetails.dateAndTime}
						onChange={(e) =>
							setClaimDetails({ ...claimDetails, dateAndTime: e.target.value })
						}
						required
					/>
					{/* Add more fields for claimDetails */}
					<label htmlFor="location">Location: </label>
					<input
						type="text"
						id="location"
						value={claimDetails.location}
						onChange={(e) =>
							setClaimDetails({ ...claimDetails, location: e.target.value })
						}
						required
					/>
					{/* ... Add other claimDetails fields ... */}
				</div>
				<div>
					<h2>Veterinary Information</h2>
					<label htmlFor="veterinarianName">Veterinarian Name: </label>
					<input
						type="text"
						id="veterinarianName"
						value={veterinaryInfo.veterinarianName}
						onChange={(e) =>
							setVeterinaryInfo({
								...veterinaryInfo,
								veterinarianName: e.target.value,
							})
						}
						required
					/>
					{/* Add more fields for veterinaryInfo */}
					<label htmlFor="contactDetails">Contact Details: </label>
					<input
						type="text"
						id="contactDetails"
						value={veterinaryInfo.contactDetails}
						onChange={(e) =>
							setVeterinaryInfo({
								...veterinaryInfo,
								contactDetails: e.target.value,
							})
						}
						required
					/>
					{/* ... Add other veterinaryInfo fields ... */}
				</div>
				<div>
					<h2>Claim Amount</h2>
					<label htmlFor="totalAmount">Total Amount: </label>
					<input
						type="number"
						id="totalAmount"
						value={claimAmount.totalAmount}
						onChange={(e) =>
							setClaimAmount({ ...claimAmount, totalAmount: e.target.value })
						}
						required
					/>
					{/* Add more fields for claimAmount */}
					<label htmlFor="deductible">Deductible: </label>
					<input
						type="number"
						id="deductible"
						value={claimAmount.deductible}
						onChange={(e) =>
							setClaimAmount({ ...claimAmount, deductible: e.target.value })
						}
						required
					/>
					{/* ... Add other claimAmount fields ... */}
				</div>
				<div>
					<h2>Declaration</h2>
					<label htmlFor="isAccurateAndTruthful">
						Is Accurate and Truthful:{" "}
					</label>
					<input
						type="checkbox"
						id="isAccurateAndTruthful"
						checked={declaration.isAccurateAndTruthful}
						onChange={(e) =>
							setDeclaration({
								...declaration,
								isAccurateAndTruthful: e.target.checked,
							})
						}
						required
					/>
					{/* Add more fields for declaration */}
					<label htmlFor="signature">Signature: </label>
					<input
						type="text"
						id="signature"
						value={declaration.signature}
						onChange={(e) =>
							setDeclaration({ ...declaration, signature: e.target.value })
						}
						required
					/>
					{/* ... Add other declaration fields ... */}
				</div>
				<div>
					<label htmlFor="supportingDocs">
						Supporting Documents (comma-separated):{" "}
					</label>
					<input
						type="text"
						id="supportingDocs"
						value={supportingDocs.join(",")}
						onChange={handleSupportingDocsChange}
						required
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default RequestClaimForm;
