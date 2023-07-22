const { ethers } = require("ethers");
const { requestAccount } = require("./commonConnectors");
const contracts = require("../../constants/contracts.json");
const claimShwanSurakshaContractAddr = contracts.ClaimShwanSuraksha[1];
const claimShwanSurakshaContractAbi = contracts.ClaimShwanSuraksha[0];

export const requestClaim = async (
	policyId,
	newClaimDetails,
	newVeterinaryInfo,
	newSupportingDocs,
	newClaimAmount,
	newDeclaration
) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			console.log({ signer });

			const contract = new ethers.Contract(
				claimShwanSurakshaContractAddr,
				claimShwanSurakshaContractAbi,
				signer
			);

			// Convert the string array to bytes32 array for newSupportingDocs
			const newSupportingDocsBytes32 = newSupportingDocs.map((doc) =>
				ethers.formatBytes32String(doc)
			);

			const tx = await contract.requestClaimPolicy(
				policyId,
				newClaimDetails,
				newVeterinaryInfo,
				newSupportingDocsBytes32,
				newClaimAmount,
				newDeclaration
			);

			await tx.wait();

			return {
				success: true,
				msg: "Claim policy request successful!",
			};
		} else {
			return {
				success: false,
				msg: "Please connect your wallet!",
			};
		}
	} catch (error) {
		return {
			success: false,
			msg: error.message,
		};
	}
};
