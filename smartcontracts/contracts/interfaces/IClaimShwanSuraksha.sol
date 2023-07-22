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

    struct ClaimAmount {
        uint256 totalAmount;
        string breakdownOfExpenses;
    }

    struct ClaimPolicyData {
        ClaimDetails claimDetails;
        VeterinaryInfo veterinaryInfo;
        ClaimAmount claimAmount;
        string supportinDocIpfsHash;
        bool isAdminApproved;
    }

    function getClaimPolicies(
        bytes32 policyId
    )
        external
        view
        returns (
            ClaimDetails memory,
            VeterinaryInfo memory,
            ClaimAmount memory,
            string memory,
            bool
        );

    function updateClaimStatus(bytes32 policyId, bool _status) external;
}
