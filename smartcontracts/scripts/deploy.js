const hre = require("hardhat");
const fs = require("fs");

let premimumCalculator, shwanSurksha, claimShwanSuraksha;

async function main() {
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
	const uSDCToken = await USDCToken.deploy("9999999999999999000000");
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

	console.log(
		"PremimumCalculator is deployed at : ",
		premimumCalculator.address
	);

	console.log("USDCToken is deployed at : ", uSDCToken.address);

	console.log(
		"claimShwanSuraksha is deployed at : ",
		claimShwanSuraksha.address
	);

	console.log("shwanSurksha is deployed at : ", shwanSurksha.address);

	// get abi of PremimumCalculator, usdcToken, shwansurksha, shwansurkshaVerifier
	const premimiumCalculatorAbi = PremimumCalculator.interface.format("json");
	const usdcTokenAbi = USDCToken.interface.format("json");
	const shwanSurkshaAbi = ShwanSurksha.interface.format("json");
	const claimShwanSurakshaAbi = ClaimShwanSuraksha.interface.format("json");

	// Write contract addresses to file
	const contracts = {
		PremimumCalculator: [premimiumCalculatorAbi, premimumCalculator.address],
		ShwanSurksha: [shwanSurkshaAbi, shwanSurksha.address],
		ClaimShwanSuraksha: [claimShwanSurakshaAbi, claimShwanSuraksha.address],
		USDCToken: [usdcTokenAbi, uSDCToken.address],
	};

	fs.writeFileSync(
		"../frontend/src/constants/contracts.json",
		JSON.stringify(contracts, null, 2)
	);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
