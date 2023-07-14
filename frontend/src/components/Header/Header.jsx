import { Link } from "react-router-dom";
import { Wallet } from "../Wallet/Wallet";

const Header = () => {
	//change address
	// provider.on("accountsChanged", (accounts) => window.location.reload());
	//chain change
	window.ethereum.on("chainChanged", (_chainId) => {
		window.location.reload();
	});

	return (
		<header className="bg-gray-900 text-lg">
			<div className="flex justify-between items-center px-4">
				<Link to="/" className="text-white text-2xl font-bold cursor-pointer">
					ShwanSuraksha
				</Link>
				<ul className="flex space-x-7">
					<li>
						<Link
							to="/quoteForm"
							className="text-white hover:text-gray-300 cursor-pointer"
						>
							Get a Quote
						</Link>
					</li>

					<li>
						<Link
							to="/claim"
							className="text-white hover:text-gray-300 cursor-pointer"
						>
							Claim policy
						</Link>
					</li>

					{/* remove it after */}
					<li>
						<Link
							to="/test"
							className="text-white hover:text-gray-300 cursor-pointer"
						>
							Test
						</Link>
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
