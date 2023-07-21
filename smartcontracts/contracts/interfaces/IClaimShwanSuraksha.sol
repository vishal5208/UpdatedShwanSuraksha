// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IClaimShwanSuraksha {
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

    function getClaimPolicies(
        bytes32 policyId
    ) external view returns (ClaimPolicyData memory);
}
