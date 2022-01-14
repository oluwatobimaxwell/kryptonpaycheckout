/* eslint-disable no-mixed-operators */
import React from "react";
import { Api } from "../classes/Api";
import { ConfimationView } from "./ConfimationView";
import { KPLoader } from "./KPLoader";
import { KPModal } from "./KPModal";
import ClockTiker from "./others";
import { Socket } from "../classes/WebSocket";
import parsePhoneNumber, { formatNumber } from 'libphonenumber-js';
import { toMoney } from "../utils/Functions";
import { connect } from "react-redux";
import { updateData, updatePrices } from "../Redux/Data/actions";

const api = new Api();
// const ws = new Socket()

export const formatPhoneNumberInt = (d) => {
	if(d) return parsePhoneNumber(d, "NG").formatInternational();
	return null;
}

const KryptonPayCheckout = (props) => {

	const business = props?.data?.initialize?.merchant || {};
	const others = props?.data?.initialize?.others || {};
	const data = props?.data?.data || {};
	const info = props?.data?.info

	window.business = props?.data;

	const defaultTitle = "Choose a coin to pay with:";
	const [view, setView] = React.useState(0);
	const [viewTitle, setViewTitle] = React.useState(defaultTitle);
	

	const [loading, setLoading] = React.useState(true);
	const [processStatus, setProcessStatus] = React.useState("");
	const [coin, setCoint] = React.useState({ coin: "ETH", amount: 0.002833646 });

	// const [data, setData] = React.useState({ user: {} });
	const [config, setConfig] = React.useState({ mode: "AUTO" });

	// const [info, setInfo] = React.useState();
	const [coins, setCoins] = React.useState([]);
	const [validatedMobile, setValidatedMobile] = React.useState();

	const setMobilePhone = (n) => {
		// setData({...data, phone: n})
		props.updateData({ data: { ...data, phone: n } });
	}

	React.useEffect(() => {
		if(validatedMobile && validatedMobile?.length >= 13){
			console.log("Phone verified")
		}
	}, [validatedMobile])

	const startConfirmation = (txId) => {
		setView(2);
		setViewTitle("Processing...");
		setProcessStatus("processing"); //1 = Success | 2 = Processing | 0 = Failed
	};

	const restartProcess = () => {
		setCoint({});
		setView(0);
		setViewTitle(defaultTitle);
	};

	const refresh = () => {
		initialize(data);
	};

	const initialize = (d) => {
		//setViewTitle(" ")
		if (!business?.identifier){
			props.updateData({ info: { message: "Initializing...", status: "processing" } })
			props.updateData({ data: d });
			setConfig({ mode: d?.viewmode });
			props.updatePrices(d, null);
		}
	};

	React.useEffect(() => {
		window.parent.postMessage({ action: "initialize", krypton_pay: true }, "*");
		window.onmessage = (e) => {
			if ( e?.data?.phone && e?.data?.key ){
				props.updateData({ data: {...e?.data, phone: formatPhoneNumberInt(e?.data?.phone) } || {} });
				initialize(e?.data || {});
				setLoading(false);
			}
		};

		// const e = { 
		// 	key: "pk_test_cb8daec88491a8021c0dcc48d461a0c49720ce1a", // Required
		// 	amount: 50000, //In Fiat Currency | Required
		// 	ref: "123456789024747", // Not Required
		// 	email: "tobisholanke@gmail.com", // Required
		// 	name: "Tobi Sholanke", // Not Required
		// 	phone: "08064670816", // Not Required
		// 	viewmode: "AUTO"
		// }
		// props.updateData({ data: {...e, phone: formatPhoneNumberInt(e?.phone) } || {} });
		// // setData({...e?.data, phone: formatPhoneNumberInt(e?.data?.phone) } || {});
		// initialize(e);
		// setLoading(false);
	}, []);

	return (

		<div id="huro-app" className="app-wrapper ">
			<div className={`pageloader is-full ${loading ? "is-active" : ""}`}></div>
			<div
				className={`infraloader is-full ${loading ? "is-active" : ""}`}
			></div>
			<div className="minimal-wrapper light">
				<div className={`landing-page-wrapper is-dark`}>
					<KPModal
						initMode={config?.mode}
						changeCoin={() => restartProcess()}
						view={view}
						loading={loading}
					>
						{(info?.status && <KPLoader {...info} />) || (
							<>
								<div
									className="experience-item"
									style={{
										display: "inline-flex",
										alignItems: "center",
										width: "100%",
										paddingBottom: 14,
										borderBottom: "1px solid #e0e0e0",
									}}
								>
									<img
										style={{ width: 40, height: 40, borderRadius: 6 }}
										src="https://logomakershop.com/__/img/logo994.png"
										alt="shop-logo"
									/>
									<div
										className="meta"
										style={{ width: "calc(100% - 50px)", textAlign: "right" }}
									>
										<span
											className="dark-inverted"
											style={{ fontWeight: "bold" }}
										>
											{business?.name}
										</span>
										<br />
										<span className="dark-inverted">{data?.email}</span>
										<br />
										<span>
											Pay{" "}
											<strong>
												{toMoney(others?.amount, others?.fiat_currency+" ")}
											</strong>
										</span>
									</div>
								</div>
								<p className="status-label">
									{viewTitle || defaultTitle}
									<span style={{ position: "absolute", right: 15 }}>
										<ClockTiker
											main={true}
											styles={{}}
											callback={refresh}
											customWrapper={true}
										/>
									</span>
								</p>
								{props?.children}
							</>
						)}
					</KPModal>
				</div>
			</div>
		</div>
	);
};



const mapStateToProps = (state) => {
	return { data: state.data };
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateData: (e) => dispatch(updateData(e)),
		updatePrices: (e, c) => dispatch(updatePrices(e, c)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(KryptonPayCheckout);


