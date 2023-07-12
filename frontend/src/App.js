import { LandingPage, QuotePage, ClaimPage } from "./pages";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<div className=" overflow-hidden">
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/quoteForm" element={<QuotePage />} />
				<Route path="/claim" element={<ClaimPage />} />
			</Routes>
		</div>
	);
}

export default App;
