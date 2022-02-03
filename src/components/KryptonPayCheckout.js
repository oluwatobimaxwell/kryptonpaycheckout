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
import { useNavigate, useParams } from "react-router-dom";
import Scanner from "./Scanner";

const api = new Api();
// const ws = new Socket()

export const formatPhoneNumberInt = (d) => {
	if(d) return parsePhoneNumber(d, "NG").formatInternational();
	return null;
}

const KryptonPayCheckout = (props) => {

	const navigate = useNavigate();

	const business = props?.data?.initialize?.merchant || props?.data?.business || {};
	const others = props?.data?.initialize?.others || {};
	const data = props?.data?.data || {};
	const info = props?.data?.info;
	const nonIntegrated = props?.data?.nonIntegrated || props?.nonIntegrated;

	window.business = props?.data;

	const defaultTitle = "Choose a coin to pay with:";
	const [view, setView] = React.useState(0);
	const [viewTitle, setViewTitle] = React.useState(defaultTitle);
	const { business_id } = useParams();

	const [loading, setLoading] = React.useState(true);
	const [processStatus, setProcessStatus] = React.useState("");

	// const [data, setData] = React.useState({ user: {} });
	const [config, setConfig] = React.useState({ mode: "AUTO" });

	const [validatedMobile, setValidatedMobile] = React.useState();

	const setMobilePhone = (n) => {
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
		setView(0);
		setViewTitle(defaultTitle);
		props.updateData({ info: {} });
		navigate(`/pay/${business_id || business?.account_number}`)
	};

	const refresh = () => {
		initialize(data);
	};

	const initialize = (d) => {
		//setViewTitle(" ")
		if (!business?.identifier || !others?.amount){

			props.updateData({ info: { message: "Initializing...", status: "processing" } })
			props.updateData({ data: d, mode: d?.viewmode });
			setConfig({ mode: d?.viewmode });
			props.updatePrices(d, null);
			setLoading(false);
			
		}else{
			setLoading(false);
		}

	};

	React.useEffect(() => {
		if(nonIntegrated){


			if((!data?.amount || data?.amount < 100 || !data?.phone) & (!window.location.pathname.includes("/pay/"))){
				navigate(`/pay/${business?.account_number}`)
			}

			if(!business?.identifier || window.location.pathname.includes("/pay/")){
				props.updateData({ nonIntegrated: true });
				api.get({}, `/business/${business_id}/getbusiness`)
				.then(res => {
					props.updateData({ business: res });
					setLoading(false);
				})
				.catch(err => {
					console.log(err)
					alert("Failed")
				})

			}else{
				
				const d = { ...props?.data?.data, key: business?.key };
				if(d?.key){
					initialize(d);
				}else{
					setLoading(false);
				}
			}
		}else{
			window.parent.postMessage({ action: "initialize", krypton_pay: true }, "*");
			window.onmessage = (e) => {
				if ( e?.data?.phone && e?.data?.key ){
					props.updateData({ data: {...e?.data, phone: formatPhoneNumberInt(e?.data?.phone) } || {} });
					initialize(e?.data || {});
					setLoading(false);
				}
			};
		}


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
		setLoading(false);

	}, []);

	return (
		<div id="huro-app" className="app-wrapper ">
			<div className={`pageloader is-full ${loading ? "is-active" : ""}`}></div>
			<div
				className={`infraloader is-full ${loading ? "is-active" : ""}`}
			></div>
			<div className="minimal-wrapper light">
				<div className={`landing-page-wrapper`}>
					<KPModal
						initMode={config?.mode}
						changeCoin={() => restartProcess()}
						view={view}
						loading={loading}
						businessId={business_id || business?.account_number}
						changeTheme={() => {
							props.updateData({
								mode: props?.data?.mode === "light" ? "dark" : "light",
							});
						}}
						nonIntegrated={nonIntegrated}
					>
						{(info?.status && <KPLoader restartProcess={restartProcess}  {...info} />) || (
							<>
								<>
								{(business?.identifier && !business?.state) ? (
									<div 
										className="test-mode">
										<p
											className="text-danger"
											style={{
												width: "max-content",
												margin: "auto",
												marginBottom: "0.75rem",
												fontWeight: "bold"
											}}
										>TEST MODE</p>
									</div>
								):null}
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
											style={{ height: 40, borderRadius: 6 }}
											src={
												business?.image ||
												"https://logomakershop.com/__/img/logo994.png"
											}
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
												{(business?.error &&
													(business?.message ||
														"Invalid Vendor ID please check and try again.")) ||
													business?.name}
											</span>
											<br />
											<span className="dark-inverted">
												{data?.email || data?.phone}{" "}
												{data?.name && (
													<>
														<small>[{data?.name}]</small>{" "}
													</>
												)}{" "}
											</span>
											<br />
											<span>
												Pay{" "}
												<strong>
													{toMoney(
														others?.amount || data?.amount,
														others?.fiat_currency,
													)}
												</strong>
											</span>
										</div>
									</div>
									{!props?.fullscreen && (
										<p className="status-label mt-2 mb-2">
											{viewTitle || defaultTitle}
										</p>
									)}
								</>
								{(((!business?.identifier &&
									!window.location.pathname.includes("/pay/")) ||
									business?.error) && <Scanner />) ||
									props?.children}
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


