// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IShwanSurksha.sol";

contract ClaimShwanSuraksha {
    IShwanSurksha public shwanSuraksha;
    mapping(bytes32 => ClaimPolicyData) private claimPolicies;
    bytes32[] private policyIds;

    address admin;

    constructor() {
        admin = msg.sender;
    }

    // modifier
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function updateShwanSurakshaAddr(
        address _shwanSurakshaAddr
    ) external onlyAdmin {
        shwanSuraksha = IShwanSurksha(_shwanSurakshaAddr);
    }

    struct ClaimDetails {
        string dateAndTime;
        string location;
        string description;
        bool isAccident;
        string[] otherPartiesInvolved;
    }

    struct VeterinaryInfo {
        string veterinarianName;
        string contactDetails;
        string clinicOrHospitalName;
        string[] visitDates;
        string diagnosis;
        string treatmentProvided;
    }

    struct SupportingDocumentation {
        string[] ipfsHashes;
    }

    // string private supportinDocIpfsHash;

    struct ClaimAmount {
        uint256 totalAmount;
        string breakdownOfExpenses;
        uint256 deductible;
        uint256 limit;
    }

    struct Declaration {
        bool isAccurateAndTruthful;
        string signature;
    }

    struct ClaimPolicyData {
        ClaimDetails claimDetails;
        VeterinaryInfo veterinaryInfo;
        SupportingDocumentation supportingDocs;
        ClaimAmount claimAmount;
        Declaration declaration;
    }

    function requestClaimPolicy(
        bytes32 policyId,
        ClaimDetails memory newClaimDetails,
        VeterinaryInfo memory newVeterinaryInfo,
        string[] memory newSupportingDocs,
        ClaimAmount memory newClaimAmount,
        Declaration memory newDeclaration
    ) external {
        address policyOwner = shwanSuraksha.getPolicyHolderAddress(policyId);
        require(
            policyOwner == msg.sender,
            "Policy does not exist or you are not the owner"
        );

        SupportingDocumentation
            memory newSupportingDoc = SupportingDocumentation(
                newSupportingDocs
            );

        ClaimPolicyData memory newClaimPolicyData = ClaimPolicyData(
            newClaimDetails,
            newVeterinaryInfo,
            newSupportingDoc,
            newClaimAmount,
            newDeclaration
        );

        claimPolicies[policyId] = newClaimPolicyData;
        policyIds.push(policyId);
    }

    function removeClaimPolicy(bytes32 policyId) external {
        address policyOwner = shwanSuraksha.getPolicyHolderAddress(policyId);
        require(
            policyOwner == msg.sender,
            "Policy does not exist or you are not the owner"
        );

        delete claimPolicies[policyId];

        for (uint256 i = 0; i < policyIds.length; i++) {
            if (policyIds[i] == policyId) {
                policyIds[i] = policyIds[policyIds.length - 1];
                policyIds.pop();
                break;
            }
        }
    }

    // getters
    function getClaimPolicies(
        bytes32 policyId
    ) external view returns (ClaimPolicyData memory) {
        return claimPolicies[policyId];
    }
}
