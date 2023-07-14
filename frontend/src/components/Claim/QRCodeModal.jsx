import React from "react";
import QRCode from "qrcode.react";
import shwanSurkshaData from "../../constants/qrCodeData";

const QRCodeModal = ({ onClose }) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white p-6 rounded-lg relative">
				<button
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
					onClick={onClose}
				>
					<span className="text-2xl font-bold">×</span>
				</button>
				<div className="mt-6">
					<QRCode value={JSON.stringify(shwanSurkshaData)} size={500} />
				</div>
			</div>
		</div>
	);
};

export default QRCodeModal;
