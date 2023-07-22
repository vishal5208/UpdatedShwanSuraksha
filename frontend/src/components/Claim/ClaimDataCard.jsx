import { ethers } from "ethers";

const ClaimDataCard = ({ policy }) => {
	return (
		<div className="flex flex-col space-y-4 p-2 text-lg border-2 border-solid border-neutral-900">
			<p>
				<span className="font-bold text-gray-800">Policy ID:</span>{" "}
				{policy.policyId}
			</p>

			<p>
				<span className="font-bold text-gray-800">Owner: </span> {policy.owner}
			</p>

			<div className="flex justify-between items-center w-3/4 mx-auto">
				<p>
					<span className="font-bold text-gray-800">Premium:</span> $
					{ethers.utils.formatUnits(policy.premium, 6)}
				</p>
				<p>
					<span className="font-bold text-gray-800">Payout:</span> $
					{ethers.utils.formatUnits(policy.payout, 6)}
				</p>
			</div>

			<div className="flex justify-between items-center w-3/4 mx-auto">
				<p>
					<span className="font-bold text-gray-800">Start Date:</span>{" "}
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
					<span className="font-bold text-gray-800">Breed:</span> {policy.breed}
				</p>
				<p>
					<span className="font-bold text-gray-800">Age in Months:</span>{" "}
					{policy.ageInMonths}
				</p>
				<p>
					<span className="font-bold text-gray-800">Health Condition:</span>{" "}
					{policy.healthCondition}
				</p>
				<p>
					<span className="font-bold text-gray-800">Region:</span>{" "}
					{policy.region}
				</p>
				<p>
					<span className="font-bold text-gray-800">Policy Type:</span>{" "}
					{policy.policyType}
				</p>
			</div>

			<div className="h-[300px] w-[300px] p-4 self-center rounded-full overflow-hidden flex items-center justify-center border border-gray-500">
				<img
					src={policy.ipfsHash}
					alt="Pet"
					className="h-full w-full object-fill rounded-full"
				/>
			</div>
		</div>
	);
};

export default ClaimDataCard;
