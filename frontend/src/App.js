import { LandingPage } from "./pages";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<div className=" overflow-hidden">
			<Routes>
				<Route path="/" element={<LandingPage />} />
			</Routes>
		</div>
	);
}

export default App;
