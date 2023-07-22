import {
	LandingPage,
	QuotePage,
	ClaimPage,
	TestPage,
	RequestClaimFormPage,
} from "./pages";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<div className=" overflow-hidden">
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/quoteForm" element={<QuotePage />} />
				<Route path="/claim" element={<ClaimPage />} />
				<Route path="/test" element={<TestPage />} />
				<Route path="/requestClaim" element={<RequestClaimFormPage />} />
			</Routes>
		</div>
	);
}

export default App;
