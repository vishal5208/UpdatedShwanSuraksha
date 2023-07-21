import { useState, useEffect } from "react";

import { getActivePoliciyOf, getPolicy } from "../backendConnectors";

import { Web3Storage } from "web3.storage";
import ClaimDataCard from "./ClaimDataCard";

const token = process.env.REACT_APP_WEB3_TOKEN;

const Claim = () => {
	const [activePolicy, setActivePolicy] = useState([]);
	const [policyData, setPolicyData] = useState([]);
	const [account, setAccount] = useState(null);
	const [policyDetailsFetching, setPolicyDetailsFetching] = useState(false);

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
			setAccount(accounts[0]);
		};

		window.ethereum.on("accountsChanged", handleAccountsChanged);

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
					const ipfsHash = data.data[11];

					const client = new Web3Storage({ token: token });
					const cid = ipfsHash.replace("ipfs://", "");
					const response = await client.get(cid);

					if (!response.ok) {
						console.error(`Error fetching image for Policy ID: ${policyId}`);
						continue; // Skip this policy and move to the next one
					}

					const files = await response.files();
					const image = URL.createObjectURL(files[0]);

					const policyData = {
						policyId: policyId,
						owner: data.data[0],
						premium: data.data[1].toString(),
						payout: data.data[2].toString(),
						startDate: data.data[3].toString(),
						endDate: data.data[4].toString(),
						claimed: data.data[5],
						breed: data.data[6],
						ageInMonths: data.data[7].toString(),
						region: data.data[8],
						healthCondition: data.data[9],
						policyType: data.data[10],
						ipfsHash: image,
					};

					updatedPolicyData.push(policyData);
				}
			}

			setPolicyData(updatedPolicyData);
		};

		fetchPolicyData();
	}, [activePolicy]);

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
								<ClaimDataCard key={policy.policyId} policy={policy} />
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
