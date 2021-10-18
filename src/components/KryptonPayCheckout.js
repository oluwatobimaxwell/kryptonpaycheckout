/* eslint-disable no-mixed-operators */
import React from "react";
import { Api } from "../utils/Api";
import { CoinPicker } from "./CoinPicker";
import { ConfimationView } from "./ConfimationView";
import { KPLoader } from "./KPLoader";
import { KPModal } from "./KPModal";
import { TransferPay } from "./TransferPay";
import { ClockTiker } from "./others";
import { Socket } from "./WebSocket";
import parsePhoneNumber, { formatNumber } from 'libphonenumber-js';

const api = new Api();
const ws = new Socket()

export const formatPhoneNumberInt = (d) => {
	if(d) return parsePhoneNumber(d, "NG").formatInternational();
	return null;
}

export const KryptonPayCheckout = () => {
	const defaultTitle = "Choose a coin to pay with:";
	const [view, setView] = React.useState(0);
	const [viewTitle, setViewTitle] = React.useState(defaultTitle);
	

	const [loading, setLoading] = React.useState(true);
	const [processStatus, setProcessStatus] = React.useState("");
	const [coin, setCoint] = React.useState({ coin: "ETH", amount: 0.002833646 });

	const [data, setData] = React.useState({ user: {} });
	const [config, setConfig] = React.useState({ mode: "AUTO" });
	const [business, setBusiness] = React.useState({ name: "The Boolean Tech, Abuja" });
	const [info, setInfo] = React.useState();
	const [coins, setCoins] = React.useState([]);
	const [others, setOthers] = React.useState({});
	const [validatedMobile, setValidatedMobile] = React.useState();

	const setMobilePhone = (n) => {
		setData({...data, phone: n})
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
		setInfo({
			message: "Initializing...",
			status: "processing",
		});
		setConfig({ mode: d?.viewmode });
		api
			.post({ amount: d?.amount }, `/business/${d?.key}/initialize`)
			.then((res) => {
				if (res?.error) {
					setInfo({
						noControls: false,
						message: res?.data?.detail || res?.message,
						status: "unknown",
					});
				} else {
					setBusiness(res?.merchant);
					setInfo({});
					setCoins(res?.coins);
					setOthers(res?.others);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	React.useEffect(() => {
		window.parent.postMessage({ action: "initialize", krypton_pay: true }, "*");
		window.onmessage = (e) => {
			setData({...e?.data, phone: formatPhoneNumberInt(e?.data?.phone) } || {});
			initialize(e?.data || {});
			setLoading(false);
		};
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
												{others?.fiat_currency} {others?.amount}
											</strong>
										</span>
									</div>
								</div>
								<p className="status-label">
									{viewTitle || defaultTitle}
									<span style={{ position: "absolute", right: 15 }}>
										<ClockTiker
											styles={{}}
											callback={refresh}
											customWrapper={true}
										/>
									</span>
								</p>

								{view === 0 ? (
									<CoinPicker
										coins={coins}
										setCoin={(e) => {
											setView(1);
											setCoint(e);
											setViewTitle("Make a Payment");
										}}
									/>
								) : view === 1 ? (
									<TransferPay
										refresh={refresh}
										coin={coin}
										confirm={startConfirmation}
										validatedMobile={validatedMobile}
										setValidatedMobile={setValidatedMobile}
										setMobilePhone={setMobilePhone}
										rawPhone={data?.phone}
									/>
								) : view === 2 ? (
									<ConfimationView
										coin={coin}
										restartProcess={restartProcess}
										changeViewTitle={setViewTitle}
									/>
								) : (
									<view />
								)}
							</>
						)}
					</KPModal>
				</div>
			</div>
		</div>
	);
};
