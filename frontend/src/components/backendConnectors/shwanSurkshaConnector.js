import { useCallback, useContext } from "react";
import { calculatePremium } from "./PremiumCalculatorConnector";

const { ethers, errors } = require("ethers");
const { requestAccount } = require("./commonConnectors");
const contracts = require("../../constants/contracts.json");

const shwanSurkshaAddress = contracts.ShwanSurksha[1];
const shwanSurkshaAbi = contracts.ShwanSurksha[0];
const usdcContractAddress = contracts.USDCToken[1];
const usdcTokenAbi = contracts.USDCToken[0];

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

			// shwansurksha contract
			const contract = new ethers.Contract(
				shwanSurkshaAddress,
				shwanSurkshaAbi,
				signer
			);

			// usdc contract
			const usdcContract = new ethers.Contract(
				usdcContractAddress,
				usdcTokenAbi,
				signer
			);

			console.log("USDC : ", usdcContract);

			//  const startDate = new Date();
			const startDate = new Date(Date.now() + 2 * 60 * 1000); // Set start date to 2 minutes ahead of the current time

			//  startDate.setDate(startDate.getDate() + 1); // Set start date to 1 day after current date
			const endDate = new Date(startDate);
			endDate.setFullYear(startDate.getFullYear() + 1); // Set end date to 1 year after start date
			const startTimestamp = Math.floor(startDate.getTime() / 1000);
			const endTimestamp = Math.floor(endDate.getTime() / 1000);

			const result = await calculatePremium({
				breed,
				age,
				region,
				healthCondition,
				policyType,
			});

			const premimum = result.success ? result.data : null;

			if (!premimum) {
				console.log(result.msg);
				return {
					success: false,
					msg: result.msg,
				};
			}

			// Convert premimum to BigNumber
			const premimumBigNumber = ethers.utils.parseUnits(premimum.toString(), 6);

			console.log("premium : ", premimumBigNumber);

			try {
				const approveTx = await usdcContract.approve(
					shwanSurkshaAddress,
					premimumBigNumber
				);
				await approveTx.wait();
			} catch (error) {
				console.log(error.message);
			}

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

export const getActivePoliciyOf = async () => {
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

			const userAddress = await signer.getAddress();

			const policyIds = await contract.getActivePoliciyOf(userAddress);

			console.log(policyIds);
			return {
				success: true,
				policyIds: policyIds,
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
				policyId: policyId,
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
