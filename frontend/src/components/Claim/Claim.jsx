import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	confirmClaim,
	getActivePoliciyOf,
	getPolicy,
} from "../backendConnectors/shwanSurkshaConnector";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import QRCodeModal from "./QRCodeModal";
const token = process.env.REACT_APP_WEB3_TOKEN;

const Claim = () => {
	const [activePolicy, setActivePolicy] = useState([]);
	const [policyData, setPolicyData] = useState([]);
	const [account, setAccount] = useState(null);
	const [policyDetailsFetching, setPolicyDetailsFetching] = useState(false);
	const [showQRCodeModal, setShowQRCodeModall] = useState(false);
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

	useEffect(() => {
		localStorage.setItem(
			"confirmedPolicies",
			JSON.stringify(confirmedPolicies)
		);
	}, [confirmedPolicies]);

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

	const handleOpenQRCodeModal = () => {
		setShowQRCodeModall(true);
	};

	const handleCloseQRCodeModal = () => {
		setShowQRCodeModall(false);
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
									className="flex flex-col p-2 text-lg border-2 border-solid border-neutral-900"
								>
									<p>
										<span className="font-bold text-gray-800">Policy ID:</span>{" "}
										{policy.policyId}
									</p>

									<p>
										<span className="font-bold text-gray-800">Owner: </span>{" "}
										{policy.owner}
									</p>

									<div className="flex justify-between items-center w-3/4 mx-auto">
										<p>
											<span className="font-bold text-gray-800">Premium:</span>{" "}
											${ethers.utils.formatUnits(policy.premium, 6)}
										</p>
										<p>
											<span className="font-bold text-gray-800">Payout:</span> $
											{ethers.utils.formatUnits(policy.payout, 6)}
										</p>
									</div>

									<div className="flex justify-between items-center w-3/4 mx-auto">
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

									<div className="flex flex-col justify-between items-center w-3/4 mx-auto">
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
										{confirmedPolicies.includes(policy.policyId) && (
											<button
												onClick={handleOpenQRCodeModal}
												className="self-center uppercase text-center text-white w-1/3 sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l from-black to-teal-800 sm:py-2"
											>
												Verify Claim
											</button>
										)}
									</div>
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

				{showQRCodeModal && <QRCodeModal onClose={handleCloseQRCodeModal} />}
			</div>
		</section>
	);
};

export default Claim;
