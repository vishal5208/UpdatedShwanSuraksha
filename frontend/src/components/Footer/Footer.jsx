const Footer = () => {
	return (
		<footer className="bg-gray-900 py-6">
			<div className="container w-3/4 mx-auto">
				<div className="flex flex-wrap justify-between">
					<div className="w-full md:w-1/2 lg:w-1/3 mb-6 md:mb-0">
						<h4 className="text-xl font-bold text-white mb-4">ShwanSuraksha</h4>
						<p className="text-white text-base">
							Provides comprehensive coverage for your furry friend.
						</p>
					</div>
					<div className="w-full md:w-1/2 lg:w-1/3 mb-6 md:mb-0">
						<h4 className="text-xl font-bold text-white mb-4">Quick Links</h4>
						<ul className="text-white">
							<li className="mb-2">About Us</li>
							<li className="mb-2">Contact Us</li>
						</ul>
					</div>
				</div>
				<div className="mt-8 text-center">
					<p className="text-white text-sm">
						&copy; {new Date().getFullYear()}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
