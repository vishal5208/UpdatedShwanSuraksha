import { Wallet } from "../Wallet/Wallet";

const Header = () => {
	return (
		<header className="bg-gray-900 text-lg">
			<div className="flex justify-between items-center px-4">
				<p className="text-white text-2xl font-bold cursor-pointer">
					ShwanSuraksha
				</p>
				<ul className="flex space-x-7">
					<li className="text-white hover:text-gray-300 cursor-pointer">
						Get Quote
					</li>
					<li className="text-white hover:text-gray-300 cursor-pointer">
						Claim Policy
					</li>
					<li className="text-white hover:text-gray-300 cursor-pointer">
						About
					</li>
				</ul>
				<div className="pr-9 py-2">
					<Wallet />
				</div>
			</div>
		</header>
	);
};

export default Header;
