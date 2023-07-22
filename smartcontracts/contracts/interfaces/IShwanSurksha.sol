// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IShwanSurksha {
    function getPolicyHolderAddress(
        bytes32 policyId
    ) external view returns (address);

    function getPolicyOwnerAndIsClaimed(
        bytes32 policyId
    ) external view returns (address, bool);
}
