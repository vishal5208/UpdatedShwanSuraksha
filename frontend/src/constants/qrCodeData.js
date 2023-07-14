const contracts = require("./contracts.json");
const shwanSurkshaData = {
	id: "c811849d-6bfb-4d85-936e-3d9759c7f105",
	typ: "application/iden3comm-plain-json",
	type: "https://iden3-communication.io/proofs/1.0/contract-invoke-request",
	body: {
		transaction_data: {
			contract_address: contracts.SwhanSurkshaClaimVerifier[1],
			method_id: "b68967e2",
			chain_id: 80001,
			network: "polygon-mumbai",
		},
		reason: "SwhanSurkshaClaim",
		scope: [
			{
				id: 1,
				circuit_id: "credentialAtomicQuerySig",
				rules: {
					query: {
						allowed_issuers: ["*"],
						req: {
							ShwanSurkshaClaim: {
								$eq: 1,
							},
						},
						schema: {
							url: "https://platform-test.polygonid.com/claim-link/cd9902a8-c4fb-4d1f-8b36-3e68f38f4487",
							type: "ShwanSurkshaClaim",
						},
					},
				},
			},
		],
	},
};

export default shwanSurkshaData;
