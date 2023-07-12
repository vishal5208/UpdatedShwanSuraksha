import { useState, useEffect } from "react";
import { getActivePoliciyOf } from "../backendConnectors/shwanSurkshaConnector";
import { getPolicy } from "../backendConnectors/shwanSurkshaConnector";
import { ethers } from "ethers";

const Claim = () => {
	const [activePolicy, setActivePolicy] = useState([]);
	const [policyData, setPolicyData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const result = await getActivePoliciyOf();

			if (result.success) {
				setActivePolicy(result.policyIds);
			}
		};

		fetchData();
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

	return (
		<section className="container mx-auto py-8">
			<div className="flex justify-center">
				<div className="flex flex-col space-y-9 bg-white rounded shadow">
					<h2 className="text-2xl font-bold text-center mt-4">
						Active Policies
					</h2>
					{policyData.length > 0 ? (
						<div className="grid grid-cols-2 gap-4">
							{policyData.map((policy) => (
								<div
									key={policy.policyId}
									className="p-4 text-lg border-2 border-solid border-neutral-900"
								>
									<p className="mb-2">
										<span className="font-bold text-gray-800">Policy ID:</span>{" "}
										{policy.policyId}
									</p>
									<p className="mb-2">
										<span className="font-bold text-gray-800">Owner:</span>{" "}
										{policy.owner}
									</p>
									<p className="mb-2">
										<span className="font-bold text-gray-800">Premium:</span> $
										{ethers.utils.formatUnits(policy.premium, 6)}
									</p>
									<p className="mb-2">
										<span className="font-bold text-gray-800">Payout:</span> $
										{ethers.utils.formatUnits(policy.payout, 6)}
									</p>
									<p className="mb-2">
										<span className="font-bold text-gray-800">Start Date:</span>{" "}
										{new Date(policy.startDate * 1000).toLocaleDateString()}
									</p>
									<p className="mb-2">
										<span className="font-bold text-gray-800">End Date:</span>{" "}
										{new Date(policy.endDate * 1000).toLocaleDateString()}
									</p>
									<p className="mb-2">
										<span className="font-bold text-gray-800">Claimed:</span>{" "}
										{policy.claimed.toString()}
									</p>
									<p className="mb-2">
										<span className="font-bold text-gray-800">Breed:</span>{" "}
										{policy.breed}
									</p>
									<p className="mb-2">
										<span className="font-bold text-gray-800">
											Age in Months:
										</span>{" "}
										{policy.ageInMonths}
									</p>
									<p className="mb-2">
										<span className="font-bold text-gray-800">
											Health Condition:
										</span>{" "}
										{policy.healthCondition}
									</p>
									<p className="mb-2">
										<span className="font-bold text-gray-800">Region:</span>{" "}
										{policy.region}
									</p>
									<p className="mb-2">
										<span className="font-bold text-gray-800">
											Policy Type:
										</span>{" "}
										{policy.policyType}
									</p>
								</div>
							))}
						</div>
					) : (
						<p className="text-center p-4">No active policies found.</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default Claim;
