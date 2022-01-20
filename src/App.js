import React from "react";
import KryptonPayCheckout from "./components/KryptonPayCheckout";
import { Provider } from "react-redux";
import store from "./Redux/store";
import CoinPicker from "./components/CoinPicker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TransferPay from "./components/TransferPay";
import ConfimationView from "./components/ConfimationView";
import HomePay from "./components/HomePay";

const App = () => {
	return (
		<Provider store={store}>
			<Router>
				<Routes>
					<Route path={"/"} element={<CoinPicker />} />
					<Route path={"/pay/:business_id"} element={<HomePay />} />
					<Route path={"/transafer-pay"} element={<TransferPay />} />
					<Route path={"/confirmation-view"} element={<ConfimationView />} />
				</Routes>
			</Router>
		</Provider>
	);
};

export default App;
