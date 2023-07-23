import { useState, useEffect } from "react";
import { Web3Storage } from "web3.storage";

import {
	getActivePoliciesForClaim,
	getRequestedPolicyIdData,
} from "../../backendConnectors";

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
					console.log(data.data);
					const ipfsHash = data.data[3];

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
						claimDetails: data.data[0],
						veterinaryInfo: data.data[1],
						claimAmount: data.data[2],
						isAdminApproved: data.data[3],
						ipfsHash: image,
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
			{/* <p>
				data :{" "}
				{policyData.length > 0 &&
					policyData.map((policy) => <div key={policy.policyId}>{policy}</div>)}
			</p> */}
		</div>
	);
};

export default Admin;
