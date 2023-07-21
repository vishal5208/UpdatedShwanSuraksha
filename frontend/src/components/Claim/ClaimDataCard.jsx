import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { confirmClaim } from "../backendConnectors";

const ClaimDataCard = ({ policy }) => {
	const [confirmedPolicies, setConfirmedPolicies] = useState(() => {
		const storedPolicies = localStorage.getItem("confirmedPolicies");
		return storedPolicies ? JSON.parse(storedPolicies) : [];
	});

	const handleConfirmClaim = async (policyId) => {
		const result = await confirmClaim(policyId);

		if (result) {
			setConfirmedPolicies((confirmedPolicies) => [
				...confirmedPolicies,
				policyId,
			]);
		} else {
			console.log("Confirmation failed");
		}
	};

	useEffect(() => {
		localStorage.setItem(
			"confirmedPolicies",
			JSON.stringify(confirmedPolicies)
		);
	}, [confirmedPolicies]);

	return (
		<div className="flex flex-col p-2 text-lg border-2 border-solid border-neutral-900">
			<p>
				<span className="font-bold text-gray-800">Policy ID:</span>{" "}
				{policy.policyId}
			</p>

			<p>
				<span className="font-bold text-gray-800">Owner: </span> {policy.owner}
			</p>

			<div className="flex justify-between items-center w-3/4 mx-auto">
				<p>
					<span className="font-bold text-gray-800">Premium:</span> $
					{ethers.utils.formatUnits(policy.premium, 6)}
				</p>
				<p>
					<span className="font-bold text-gray-800">Payout:</span> $
					{ethers.utils.formatUnits(policy.payout, 6)}
				</p>
			</div>

			<div className="flex justify-between items-center w-3/4 mx-auto">
				<p>
					<span className="font-bold text-gray-800">Start Date:</span>{" "}
					{new Date(policy.startDate * 1000).toLocaleDateString()}
				</p>
				<p>
					<span className="font-bold text-gray-800">End Date:</span>{" "}
					{new Date(policy.endDate * 1000).toLocaleDateString()}
				</p>
			</div>

			<div className="flex flex-col justify-between items-center w-3/4 mx-auto">
				<p>
					<span className="font-bold text-gray-800">Claimed:</span>{" "}
					{policy.claimed ? "YES" : "NO"}
				</p>
				<p>
					<span className="font-bold text-gray-800">Breed:</span> {policy.breed}
				</p>
				<p>
					<span className="font-bold text-gray-800">Age in Months:</span>{" "}
					{policy.ageInMonths}
				</p>
				<p>
					<span className="font-bold text-gray-800">Health Condition:</span>{" "}
					{policy.healthCondition}
				</p>
				<p>
					<span className="font-bold text-gray-800">Region:</span>{" "}
					{policy.region}
				</p>
				<p>
					<span className="font-bold text-gray-800">Policy Type:</span>{" "}
					{policy.policyType}
				</p>
			</div>

			<div className="w-[50%] h-[50%] self-center my-4 border border-gray-300 rounded-lg overflow-hidden">
				<img
					src={policy.ipfsHash}
					alt="Pet"
					className="w-full h-full object-cover"
				/>
			</div>

			<div className="flex items-center justify-center space-x-8">
				<button
					onClick={() => {
						if (!confirmedPolicies.includes(policy.policyId)) {
							handleConfirmClaim(policy.policyId);
						}
					}}
					className={`${
						confirmedPolicies.includes(policy.policyId)
							? "self-center uppercase text-center text-white w-1/3 sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l from-black to-teal-800 sm:py-2"
							: "self-center uppercase text-center text-white w-1/3 sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l from-black to-purple-800 sm:py-2"
					}`}
					disabled={confirmedPolicies.includes(policy.policyId)}
				>
					{confirmedPolicies.includes(policy.policyId) ? (
						<Link
							to="https://platform-test.polygonid.com/claim-link/cd9902a8-c4fb-4d1f-8b36-3e68f38f4487"
							target="_blank"
							className="text-white"
						>
							Claim Now
						</Link>
					) : (
						"Confirm a claim"
					)}
				</button>
			</div>
		</div>
	);
};

export default ClaimDataCard;
