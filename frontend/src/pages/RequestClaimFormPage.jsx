import { RequestClaimForm, Header, Footer } from "../components";

const RequestClaimFormPage = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<div className="flex-grow">
				<RequestClaimForm />
			</div>
			<Footer />
		</div>
	);
};

export default RequestClaimFormPage;
