require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
		version: "0.8.4",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},

	networks: {
		polygon_mumbai: {
			url: process.env.POLYGON_TESTNET_URL,
			accounts: [process.env.PRIVATE_KEY],
		},
	},
	etherscan: {
		// yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
		apiKey: {
			polygonMumbai: process.env.POLYGONSCAN_API_KEY,
		},
	},
};
