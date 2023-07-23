import { useState, useEffect } from "react";
import { Web3Storage } from "web3.storage";

import {
	getActivePoliciesForClaim,
	getRequestedPolicyIdData,
} from "../../backendConnectors";

import RequestedClaimDataCard from "./RequestedClaimDataCard";

const token = process.env.REACT_APP_WEB3_TOKEN;

const Admin = () => {
	const [activePolicies, setactivePolicies] = useState([]);
	const [policyData, setPolicyData] = useState([]);
	const [account, setAccount] = useState(null);
	const [policyDetailsFetching, setPolicyDetailsFetching] = useState(false);

	// whenever account changes fetch the new policy ids
	useEffect(() => {
		const fetchData = async () => {
			setPolicyDetailsFetching(true);
			const result = await getActivePoliciesForClaim();

			if (result.success) {
				setactivePolicies(result.activePolicyIdsForClaim);
			}

			setPolicyDetailsFetching(false);
		};

		fetchData();
	}, [account]);

	// set event listner to listen for accounts change and whenever componets unmount remove the listner
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

			for (const policyId of activePolicies) {
				const data = await getRequestedPolicyIdData(policyId);
				console.log("data : ", data);

				if (data.success) {
					const ipfsHash = data.data[3];
					console.log("ipfshash : ", ipfsHash);

					const documentLink = `https://dweb.link/ipfs/${ipfsHash}`;

					const policyData = {
						policyId: policyId,
						claimDetails: data.data[0],
						veterinaryInfo: data.data[1],
						claimAmount: data.data[2],
						// isAdminApproved: data.data[3],
						ipfsFiles: documentLink,
					};

					updatedPolicyData.push(policyData);
				}
			}

			setPolicyData(updatedPolicyData);
		};

		fetchPolicyData();
	}, [activePolicies]);

	return (
		<div>
			<section className="container mx-auto  py-8">
				<div className="flex justify-center">
					<div className="flex flex-col space-y-9 bg-white ">
						<div className="flex justify-evenly">
							<h2 className="text-3xl self-center font-bold text-center mt-4">
								Claim Details Overview
							</h2>
						</div>
						{policyData.length > 0 && !policyDetailsFetching ? (
							<div className="grid grid-cols-2 gap-4 p-4 uppercase">
								{policyData.map((policy) => (
									<RequestedClaimDataCard
										key={policy.policyId}
										policy={policy}
									/>
								))}
							</div>
						) : (
							<div>
								{policyData.length === 0 && !policyDetailsFetching && (
									<p className="text-center text-xl font-semibold text-black p-4">
										No active claim requests found.
									</p>
								)}

								{policyDetailsFetching && (
									<div className="text-xl font-semibold text-black">
										Fetching claim requests details... Please wait a moment.
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

export default Admin;
