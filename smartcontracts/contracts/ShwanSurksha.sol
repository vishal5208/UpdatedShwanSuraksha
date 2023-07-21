// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IPremimumCalculator.sol";
import "./ClaimShwanSuraksha.sol";

contract ShwanSurksha {
    struct Policy {
        address owner;
        uint256 premium;
        uint256 payout;
        uint256 startDate;
        uint256 endDate;
        bool claimed;
        string breed;
        uint ageInMonths;
        string healthCondition;
        string region;
        string policyType;
        string ipfsHash;
    }

    // Mapping to store policies by their unique ID
    mapping(bytes32 => Policy) policy;
    mapping(address => bytes32[]) public policyHolderToIDs;

    // Events to emit when policies are added and claimed
    event PolicyAdded(
        bytes32 indexed policyId,
        address indexed owner,
        uint256 premium,
        uint256 payout,
        uint256 startDate,
        uint256 endDate
    );
    event PolicyClaimed(
        bytes32 indexed policyId,
        address indexed owner,
        uint256 payout
    );
    event PolicyUpdated(
        bytes32 indexed policyId,
        address indexed owner,
        uint256 newEndDate
    );
    event policyCancelled(bytes32 indexed policyId, address indexed owner);

    IERC20 usdc;
    IPremimumCalculator premimumCalculator;
    address private claimShwanSuraksha;

    address admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function updateContractsAddress(
        address _usdcTokenAddress,
        address _premimumCalculator,
        address _claimShwanSurakshaContractAddress
    ) external onlyAdmin {
        usdc = IERC20(_usdcTokenAddress);
        premimumCalculator = IPremimumCalculator(_premimumCalculator);
        claimShwanSuraksha = _claimShwanSurakshaContractAddress;
    }

    // Function to add a new policy
    function addPolicy(
        string memory _breed,
        uint _ageInMonths,
        string memory _healthCondition,
        string memory _region,
        string memory _policyType,
        uint256 startDate,
        uint256 endDate,
        string memory _ipfsHash
    ) external {
        bytes32 policyId = keccak256(
            abi.encodePacked(
                msg.sender,
                block.timestamp,
                _breed,
                _ageInMonths,
                _healthCondition,
                _region,
                _policyType,
                _ipfsHash
            )
        );

        require(policy[policyId].owner == address(0), "Policy already exists");

        require(startDate > block.timestamp, "Invalid start date");
        require(endDate > startDate, "Invalid end date");

        uint premium = premimumCalculator.calculatePremium(
            _breed,
            _ageInMonths,
            _healthCondition,
            _region,
            _policyType
        );
        uint payout = premimumCalculator.calculatePayout(premium);

        // Approve transfer of premium amount from user's account to the contract
        require(usdc.approve(address(this), premium), "USDC approval failed");
        require(
            usdc.transferFrom(msg.sender, address(this), premium),
            "USDC transfer failed"
        );

        policy[policyId] = Policy(
            msg.sender,
            premium,
            payout,
            startDate,
            endDate,
            false,
            _breed,
            _ageInMonths,
            _healthCondition,
            _region,
            _policyType,
            _ipfsHash
        );

        policyHolderToIDs[msg.sender].push(policyId);

        emit PolicyAdded(
            policyId,
            msg.sender,
            premium,
            payout,
            startDate,
            endDate
        );
    }

    function approveClaim(bytes32 policyId) external onlyAdmin returns (bool) {
        Policy storage _policy = policy[policyId];

        require(!_policy.claimed, "Policy has already been claimed");

        require(
            block.timestamp > _policy.startDate,
            "Policy has not expired yet"
        );

        _policy.claimed = true;

        bool isDone = usdc.transfer(_policy.owner, _policy.payout);

        if (isDone) {
            emit PolicyClaimed(policyId, _policy.owner, _policy.payout);
            return true;
        }

        return false;
    }

    // cancelPolicy
    function cancelPolicy(bytes32 policyId) external {
        Policy storage _policy = policy[policyId];

        require(_policy.owner != address(0), "Policy does not exist");
        require(!_policy.claimed, "Policy has already been claimed");

        require(
            block.timestamp > _policy.startDate &&
                block.timestamp < _policy.endDate,
            "You can only claim the policy"
        );

        require(
            usdc.transfer(_policy.owner, _policy.premium),
            "USDC transfer failed"
        );

        delete policy[policyId];
        removePolicy(_policy.owner, policyId);

        emit policyCancelled(policyId, _policy.owner);
    }

    function removePolicy(address policyHolder, bytes32 policyId) internal {
        bytes32[] storage policies = policyHolderToIDs[policyHolder];
        for (uint i = 0; i < policies.length; i++) {
            if (policies[i] == policyId) {
                // Remove the opportunity ID from the array
                policies[i] = policies[policies.length - 1];
                policies.pop();
                break;
            }
        }
    }

    function updatePolicy(bytes32 policyId, uint256 newEndDate) public {
        Policy storage _policy = policy[policyId];

        require(
            _policy.owner == msg.sender,
            "Policy does not exist or you are not the owner"
        );

        // Check that the new end date is greater than the current end date
        require(
            newEndDate > _policy.endDate,
            "New end date must be after current end date"
        );

        // Update the policy's end date
        _policy.endDate = newEndDate;

        emit PolicyUpdated(policyId, msg.sender, newEndDate);
    }

    // getters
    function getPolicy(
        bytes32 policyId
    )
        public
        view
        returns (
            address owner,
            uint256 premium,
            uint256 payout,
            uint256 startDate,
            uint256 endDate,
            bool claimed,
            string memory breed,
            uint ageInMonths,
            string memory healthCondition,
            string memory region,
            string memory policyType,
            string memory ipfsHash
        )
    {
        Policy storage _policy = policy[policyId];
        require(_policy.owner != address(0), "Policy does not exist");
        return (
            _policy.owner,
            _policy.premium,
            _policy.payout,
            _policy.startDate,
            _policy.endDate,
            _policy.claimed,
            _policy.breed,
            _policy.ageInMonths,
            _policy.healthCondition,
            _policy.region,
            _policy.policyType,
            _policy.ipfsHash
        );
    }

    function getActivePoliciyOf(
        address policyHolder
    ) external view returns (bytes32[] memory) {
        require(policyHolder != address(0), "Invalid policyHolder address");

        return policyHolderToIDs[policyHolder];
    }

    function getPolicyHolderAddress(
        bytes32 policyId
    ) external view returns (address) {
        Policy storage _policy = policy[policyId];
        require(_policy.owner != address(0), "Policy does not exist");

        return _policy.owner;
    }
}
