// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IPremimumCalculator.sol";
import "./interfaces/IClaimShwanSuraksha.sol";
import "hardhat/console.sol";

contract ShwanSurksha {
    struct PetData {
        string breed;
        uint ageInMonths;
        string healthCondition;
        string region;
    }

    struct Policy {
        address owner;
        uint256 premium;
        uint256 payout;
        uint256 startDate;
        uint256 endDate;
        bool claimed;
        bool claimRequested;
        string policyType;
        string ipfsHash;
        PetData petData;
    }

    // Mapping to store policies by their unique ID
    mapping(bytes32 => Policy) private policy;
    mapping(address => bytes32[]) private policyHolderToIDs;

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
    IClaimShwanSuraksha private claimShwanSuraksha;

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
        address _claimShwanSuraksha
    ) external onlyAdmin {
        usdc = IERC20(_usdcTokenAddress);
        premimumCalculator = IPremimumCalculator(_premimumCalculator);
        claimShwanSuraksha = IClaimShwanSuraksha(_claimShwanSuraksha);
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

        PetData memory petdata = PetData(
            _breed,
            _ageInMonths,
            _healthCondition,
            _region
        );

        policy[policyId] = Policy(
            msg.sender,
            premium,
            payout,
            startDate,
            endDate,
            false,
            false,
            _policyType,
            _ipfsHash,
            petdata
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
        console.log("idhar");
        Policy storage _policy = policy[policyId];
        (, , , , bool isAdminApproved) = claimShwanSuraksha
            .getRequestedPolicyIdData(policyId);

        require(!_policy.claimed, "Policy has already been claimed");
        require(
            !isAdminApproved,
            "Policy has already been approved by the administrator."
        );

        require(
            block.timestamp > _policy.startDate,
            "Policy has not expired yet"
        );

        _policy.claimed = true;
        claimShwanSuraksha.updateClaimStatus(policyId, true);

        bool isDone = usdc.transfer(_policy.owner, _policy.payout);

        if (isDone) {
            removePolicy(_policy.owner, policyId);
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
        delete policy[policyId];

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

    modifier onlyClaimShwanSurakshaContract() {
        require(
            msg.sender == address(claimShwanSuraksha),
            "Only ShwanSurakshaClaimContract can perform this action"
        );
        _;
    }

    function updateClaimRequestedStatus(
        bytes32 policyId,
        bool _claimRequestedStatus
    ) external onlyClaimShwanSurakshaContract {
        Policy storage _policy = policy[policyId];

        _policy.claimRequested = _claimRequestedStatus;
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
            bool claimRequested,
            string memory policyType,
            string memory ipfsHash,
            PetData memory petdata
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
            _policy.claimRequested,
            _policy.policyType,
            _policy.ipfsHash,
            _policy.petData
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

    function getPolicyOwnerAndIsClaimed(
        bytes32 policyId
    ) external view returns (address, bool) {
        Policy storage _policy = policy[policyId];
        require(_policy.owner != address(0), "Policy does not exist");

        return (_policy.owner, _policy.claimed);
    }
}
