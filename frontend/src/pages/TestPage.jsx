import { ethers } from "ethers";
import {
	getAllowance,
	increaseAllowance,
	decreaseAllowance,
	approve,
} from "../components/backendConnectors/usdcConnector";
const contracts = require("../constants/contracts.json");
const sixDecimal = 6;
const ShwanSurkshaAddress = contracts.ShwanSurksha[1];

const TestPage = () => {
	return <div></div>;
};

export default TestPage;
