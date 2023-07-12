const { ethers } = require("ethers");
const { requestAccount } = require("./commonConnectors");
const contracts = require("../../constants/contracts.json");

const shwanSurkshaAddress = contracts.ShwanSurksha[1];
const shwanSurkshaAbi = contracts.ShwanSurksha[0];

export const addPolicy = async ({
	breed,
	age,
	region,
	healthCondition,
	policyType,
}) => {
	console.log("in function : ", {
		breed,
		age,
		region,
		healthCondition,
		policyType,
	});
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			console.log({ signer });
			const contract = new ethers.Contract(
				shwanSurkshaAddress,
				shwanSurkshaAbi,
				signer
			);

			//  const startDate = new Date();
			const startDate = new Date(Date.now() + 2 * 60 * 1000); // Set start date to 2 minutes ahead of the current time

			//  startDate.setDate(startDate.getDate() + 1); // Set start date to 1 day after current date
			const endDate = new Date(startDate);
			endDate.setFullYear(startDate.getFullYear() + 1); // Set end date to 1 year after start date
			const startTimestamp = Math.floor(startDate.getTime() / 1000);
			const endTimestamp = Math.floor(endDate.getTime() / 1000);

			const addPolicyTx = await contract.addPolicy(
				breed,
				age,
				region,
				healthCondition,
				policyType,
				startTimestamp.toString(),
				endTimestamp.toString()
			);

			const addPolicyRec = await addPolicyTx.wait();
			const { args } = addPolicyRec.events.find(
				(event) => event.event === "PolicyAdded"
			);
			const policyId = args.policyId;
			return {
				success: true,
				msg: "Policy added successfully.",
				policyId: policyId,
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

export const getActivePoliciyOf = async (userAddr) => {
	console.log("User Address : ", userAddr);
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			console.log({ signer });
			const contract = new ethers.Contract(
				shwanSurkshaAddress,
				shwanSurkshaAbi,
				signer
			);

			const policyId = await contract.getActivePoliciyOf(userAddr);

			console.log(policyId);
			return policyId;
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

export const getPolicy = async (policyId) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await window.ethereum.request({ method: "eth_requestAccounts" });
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				shwanSurkshaAddress,
				shwanSurkshaAbi,
				signer
			);

			const policyData = await contract.getPolicy(policyId);

			return {
				success: true,
				data: policyData,
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

export const claimPolicy = async (policyId) => {
	console.log(policyId, "policyId");
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			console.log({ signer });
			const contract = new ethers.Contract(
				shwanSurkshaAddress,
				shwanSurkshaAbi,
				signer
			);
			const transaction = await contract.claimPolicy(policyId);
			console.log(transaction);
			await transaction.wait(); // Wait for transaction to be mined
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const cancelPolicy = async (policyId) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				shwanSurkshaAddress,
				shwanSurkshaAbi,
				signer
			);

			const receipt = await contract.cancelPolicy(policyId);

			const filter = contract.filters.PolicyCancelled();
			contract.on(filter, (policyId, owner) => {
				console.log(`Policy cancelled with ID ${policyId}`);
				const alertBox = document.createElement("div");
				alertBox.classList.add("alert-box");
				alertBox.textContent = `Policy Cancelled Successfully with policy ID ${policyId}`;
				document.body.appendChild(alertBox);
				setTimeout(() => alertBox.remove(), 5000);
				return policyId;
			});
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
