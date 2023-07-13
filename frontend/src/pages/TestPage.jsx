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
	const handleApprove = async () => {
		const premium = 10 * 10 ** sixDecimal;

		const allowanceResult = await getAllowance(ShwanSurkshaAddress);

		if (allowanceResult.success) {
			const allowance = allowanceResult.allowance;

			const remaining = premium - allowance.toString();

			if (remaining > 0) {
				const increaseAllowanceRes = await increaseAllowance(
					ShwanSurkshaAddress,
					remaining
				);

				if (!increaseAllowanceRes.success) {
					console.log(increaseAllowanceRes.msg);
				}
			} else if (remaining < 0) {
				const decreaseAllowanceRes = await decreaseAllowance(
					ShwanSurkshaAddress,
					Math.abs(remaining)
				);

				if (!decreaseAllowanceRes.success) {
					console.log(decreaseAllowanceRes.msg);
				}
			}
			console.log(premium);
			console.log("allownce : ", allowance.toString());
			console.log("remaing : ", remaining);

			// const result = await approve(ShwanSurkshaAddress, remaining);
			// const data = result.data;
			// console.log(data.owner, data.spender, data.value.toString());
		}
	};
	return (
		<div>
			<button onClick={handleApprove}>approve</button>
		</div>
	);
};

export default TestPage;
