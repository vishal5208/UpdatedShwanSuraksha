const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("VDToken", function () {
	let premimumCalculator, shwanSurksha, claimShwanSuraksha, uSDCToken;

	beforeEach(async () => {
		// premium calculator
		const PremimumCalculator = await hre.ethers.getContractFactory(
			"PremimumCalculator"
		);
		premimumCalculator = await PremimumCalculator.deploy();
		await premimumCalculator.deployed();

		// inititalze premimiumCalculator
		await premimumCalculator.initialize("100000000", "5", "190");

		// usdcToken
		const USDCToken = await hre.ethers.getContractFactory("USDCToken");
		uSDCToken = await USDCToken.deploy("9999999999999999000000");
		await uSDCToken.deployed();

		// shwanSurksha
		const ShwanSurksha = await hre.ethers.getContractFactory("ShwanSurksha");
		shwanSurksha = await ShwanSurksha.deploy();
		await shwanSurksha.deployed();

		//claimShwanSuraksha
		const ClaimShwanSuraksha = await hre.ethers.getContractFactory(
			"ClaimShwanSuraksha"
		);
		claimShwanSuraksha = await ClaimShwanSuraksha.deploy();
		await claimShwanSuraksha.deployed();

		// initialize shwanSurksha
		await shwanSurksha.updateContractsAddress(
			uSDCToken.address,
			premimumCalculator.address,
			claimShwanSuraksha.address
		);

		await claimShwanSuraksha.updateShwanSurakshaAddr(shwanSurksha.address);
	});

	it("integrated testing", async function () {
		let timestamp = await time.latest();
		await uSDCToken.approve(shwanSurksha.address, "99999900000");
		const tx = await shwanSurksha.addPolicy(
			"Labrador Retrieve",
			"10",
			"SEVERE",
			"South",
			"Premium",
			timestamp + 20,
			timestamp + 1000,
			"vishal"
		);

		const txRec = await tx.wait();

		const policyId = txRec.events[3].args.policyId;

		const claimDetails = {
			dateAndTime: "2023-07-23 12:00:00",
			location: "Example Location",
			description: "Example claim description",
			isAccident: true,
			otherPartiesInvolved: ["Party A", "Party B"],
		};
		const veterinaryInfo = {
			veterinarianName: "Vet Name",
			contactDetails: "Vet Contact",
			clinicOrHospitalName: "Vet Clinic",
			visitDates: ["2023-07-23"],
			diagnosis: "Example diagnosis",
			treatmentProvided: "Example treatment",
		};
		const supportingDocIpfsHash = "QmHash"; // Replace with the actual IPFS hash
		const claimAmount = {
			totalAmount: ethers.utils.parseEther("1"), // Example: 1 ETH
			breakdownOfExpenses: "Example expenses breakdown",
		};

		await claimShwanSuraksha.requestClaimPolicy(
			policyId,
			claimDetails,
			veterinaryInfo,
			supportingDocIpfsHash,
			claimAmount
		);

		await network.provider.send("evm_increaseTime", [130]);
		await network.provider.send("evm_mine", []);

		await uSDCToken.transfer(shwanSurksha.address, "1000099000000");
		await shwanSurksha.approveClaim(policyId);
	});
});
