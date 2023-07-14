import { useState, useEffect } from "react";
import {
	confirmClaim,
	getActivePoliciyOf,
} from "../backendConnectors/shwanSurkshaConnector";
import { getPolicy } from "../backendConnectors/shwanSurkshaConnector";
import { ethers } from "ethers";

const Claim = () => {
	const [activePolicy, setActivePolicy] = useState([]);
	const [policyData, setPolicyData] = useState([]);
	const [account, setAccount] = useState(null);
	const [confirmingClaim, setConfirmingClaim] = useState(false); // to be added
	const [policyDetailsFetching, setPolicyDetailsFetching] = useState(false);

	// keep track of confirmed polices
	const [confirmedPolicies, setConfirmedPolicies] = useState(() => {
		const storedPolicies = localStorage.getItem("confirmedPolicies");
		return storedPolicies ? JSON.parse(storedPolicies) : [];
	});

	useEffect(() => {
		const fetchData = async () => {
			setPolicyDetailsFetching(true);
			const result = await getActivePoliciyOf();

			if (result.success) {
				setActivePolicy(result.policyIds);
			}

			setPolicyDetailsFetching(false);
		};

		fetchData();
	}, [account]);

	useEffect(() => {
		const handleAccountsChanged = (accounts) => {
			// console.log(accounts);
			setAccount(accounts[0]);
		};

		// Add event listener for 'accountsChanged'
		window.ethereum.on("accountsChanged", handleAccountsChanged);

		// Cleanup: Remove event listener when component unmounts
		return () => {
			window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
		};
	}, []);

	useEffect(() => {
		const fetchPolicyData = async () => {
			let updatedPolicyData = [];

			for (const policyId of activePolicy) {
				const data = await getPolicy(policyId);

				if (data.success) {
					const policyData = {
						policyId: policyId,
						owner: data.data[0],
						premium: data.data[1].toString(), // Convert BigNumber to string
						payout: data.data[2].toString(), // Convert BigNumber to string
						startDate: data.data[3].toString(), // Convert BigNumber to string
						endDate: data.data[4].toString(), // Convert BigNumber to string
						claimed: data.data[5],
						breed: data.data[6],
						ageInMonths: data.data[7].toString(), // Convert BigNumber to string
						region: data.data[8],
						healthCondition: data.data[9],
						policyType: data.data[10],
					};

					updatedPolicyData.push(policyData);
				}
			}

			setPolicyData(updatedPolicyData);
		};

		fetchPolicyData();
	}, [activePolicy]);

	// to stored confirmed policies in browser
	useEffect(() => {
		localStorage.setItem(
			"confirmedPolicies",
			JSON.stringify(confirmedPolicies)
		);
	}, [confirmedPolicies]);

	const handleConfirmClaim = async (policyId) => {
		const result = await confirmClaim(policyId);

		if (result) {
			// confirmedPolices as previous state and appends policyId to it
			setConfirmedPolicies((confirmedPolicies) => [
				...confirmedPolicies,
				policyId,
			]);
		} else {
			console.log("Confirmation failed");
		}
	};

	return (
		<section className="container mx-auto  py-8">
			<div className="flex justify-center">
				<div className="flex flex-col space-y-9 bg-white ">
					<h2 className="text-3xl font-bold text-center mt-4">
						Active Policies
					</h2>
					{policyData.length > 0 && !policyDetailsFetching ? (
						<div className="grid grid-cols-2 gap-4 p-4 uppercase">
							{policyData.map((policy) => (
								<div
									key={policy.policyId}
									className=" flex flex-col p-2  text-lg border-2 border-solid border-neutral-900"
								>
									<p>
										<span className="font-bold text-gray-800">Policy ID:</span>{" "}
										{policy.policyId}
									</p>

									<p>
										<span className="font-bold text-gray-800">Owner: </span>{" "}
										{policy.owner}
									</p>

									<div className="flex justify-between  items-center w-3/4 mx-auto">
										<p>
											<span className="font-bold text-gray-800">Premium:</span>{" "}
											${ethers.utils.formatUnits(policy.premium, 6)}
										</p>
										<p>
											<span className="font-bold text-gray-800">Payout:</span> $
											{ethers.utils.formatUnits(policy.payout, 6)}
										</p>
									</div>

									<div className="flex justify-between  items-center w-3/4 mx-auto">
										<p>
											<span className="font-bold text-gray-800">
												Start Date:
											</span>{" "}
											{new Date(policy.startDate * 1000).toLocaleDateString()}
										</p>
										<p>
											<span className="font-bold text-gray-800">End Date:</span>{" "}
											{new Date(policy.endDate * 1000).toLocaleDateString()}
										</p>
									</div>

									<div className="flex flex-col justify-between  items-center w-3/4 mx-auto">
										<p>
											<span className="font-bold text-gray-800">Claimed:</span>{" "}
											{policy.claimed ? "YES" : "NO"}
										</p>
										<p>
											<span className="font-bold text-gray-800">Breed:</span>{" "}
											{policy.breed}
										</p>
										<p>
											<span className="font-bold text-gray-800">
												Age in Months:
											</span>{" "}
											{policy.ageInMonths}
										</p>
										<p>
											<span className="font-bold text-gray-800">
												Health Condition:
											</span>{" "}
											{policy.healthCondition}
										</p>
										<p>
											<span className="font-bold text-gray-800">Region:</span>{" "}
											{policy.region}
										</p>
										<p>
											<span className="font-bold text-gray-800">
												Policy Type:
											</span>{" "}
											{policy.policyType}
										</p>
									</div>

									<button
										onClick={() => handleConfirmClaim(policy.policyId)}
										disabled={confirmedPolicies.includes(policy.policyId)}
										className={`self-center text-center text-white w-1/3 sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l from-black to-purple-800 sm:py-2 ${
											confirmedPolicies.includes(policy.policyId)
												? "pointer-events-none opacity-50 cursor-not-allowed"
												: ""
										}`}
									>
										{confirmingClaim ? "Confirming a claim" : "Confirm a claim"}
									</button>
								</div>
							))}
						</div>
					) : (
						<div>
							{policyData.length === 0 && !policyDetailsFetching && (
								<p className="text-center text-xl font-semibold text-black p-4">
									No active policies found.
								</p>
							)}

							{policyDetailsFetching && (
								<div className="text-xl font-semibold text-black">
									Fetching policy details... Please wait a moment.
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default Claim;
