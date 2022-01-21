/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-mixed-operators */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { getIcon, processError, storeObject, toMoney } from "../utils/Functions";
import { SvgIcon } from "./SvgIcon";
import QRCode from "react-qr-code";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import OtpInput from "react-otp-input";
import { KPLoader } from "./KPLoader";
import { Api } from "../classes/Api";
import { formatPhoneNumberInt } from "./KryptonPayCheckout";
import { connect } from "react-redux";
import { continuousConfirmation, updateData } from "../Redux/Data/actions";
import KryptonPayCheckout from './KryptonPayCheckout';
import { useNavigate } from "react-router-dom";
import ClockTiker from "./others";
import { v4 } from "uuid";
import { Socket } from "../classes/WebSocket";

const api = new Api();

export const CopyText = ({ icon, text }) => {
	const [copy, setCopy] = React.useState(false);

	const copyToClipBoard = (text) => {
		navigator.clipboard.writeText(text).then(
			function () {
				setCopy(true);
				setInterval(() => {
					setCopy(false);
				}, 5500);
			},
			function (err) {
				console.error("Async: Could not copy text: ", err);
			},
		);
	};

	return (
		<div className={"copy-item"} style={{ width: 20, float: "right" }}>
			<span className="icon" onClick={() => copyToClipBoard(text)}>
				<SvgIcon name={"copy"} size={15} />
				{copy && <small className="copy-text">copied</small>}
			</span>
		</div>
	);
};

export const RequestOTP = ({
	loading,
	getOTP,
	mobilePhone,
	setMobilePhone,
	close
}) => {
	const [edit, setEdit] = React.useState(false);
	const [mobile, setMobile] = React.useState(mobilePhone);
	const [userinput, setUserInput] = React.useState(mobilePhone);
	const [isValid, setValid] = React.useState(false);

	React.useEffect(() => {
		if (!mobilePhone) setEdit(true);
	}, [mobilePhone]);

	const hideMobile = (x) => {
		return "+••• ••• ••• •" + x?.substring(x?.length - 3);
	};

	return (
		<div className="glass-box p-5">
			<div
				className="flex-cell is-bordered mt-3"
				style={{ textAlign: "center" }}
			>
				<i
					className="lnil lnil-lock-alt mb-5"
					style={{ fontWeight: "bold", fontSize: 40 }}
				/>
				<h3 style={{ fontSize: 18, fontWeight: "bold" }}>OTP Verification</h3>
				<h4 style={{ fontSize: 14, paddingRight: 15, paddingLeft: 15 }}>
					We will send you a <strong>One Time Pin</strong> on this mobile number
				</h4>

				<div style={{ marginTop: 25 }}>
					<h4 style={{ fontSize: 14, marginBottom: 10 }}>
						{edit ? "Enter mobile number" : "Mobile number to receive OTP"}
					</h4>
					<div className="field has-addons">
						<div className="control is-expanded">
							{(edit && (
								<div style={{ textAlign: "left" }}>
									<PhoneInput
										country={"ng"}
										// prefix={"+234"}
										value={userinput}
										// onlyCountries={["ng", "gh", "us", "gb"]}
										inputStyle={{
											fontSize: 20,
											fontWeight: "bold",
											border: "none",
											background: "none",
											textAlign: "center",
										}}
										// disabled={true}
										onChange={(value, country, e, formattedValue) => {
											setUserInput(value);
											console.log(value);
										}}
										isValid={(value, country) => {
											if (value?.length !== 13) {
												setValid(false);
												return "Should be exactly 14 digits (including country code)";
											}
											setValid(true);
											return true;
										}}
									/>
								</div>
							)) || (
								<h4 style={{ fontSize: 20, padding: 3, fontWeight: "bold" }}>
									{hideMobile(mobile)}
								</h4>
							)}
						</div>

						<div
							onClick={() => {
								if (edit && userinput) {
									setMobile(userinput);
									setMobilePhone && setMobilePhone(userinput);
								}
								if (edit && !isValid) return;
								setEdit(!edit);
							}}
							className="control "
							style={{ cursor: "pointer" }}
						>
							{(!edit && (
								<>
									{/* <i
									className="lnil lnil-pencil mb-5"
									style={{ paddingTop: 15 }}
								/> */}
									<SvgIcon name={"edit-3"} />
								</>
							)) || (
								<>
									{/* <i
									className="lnil lnil-checkmark mb-5"
									style={{ paddingTop: 15 }}
								/> */}
									<SvgIcon name={"check-squared"} />
								</>
							)}
						</div>
					</div>
					{!edit && (
						<button
							class={`button h-button is-primary is-elevated w-100 ${
								loading && "is-loading"
							} `}
							style={{ border: "none", fontWeight: "bold", padding: 20 }}
							onClick={() => getOTP(userinput)}
						>
							Get OTP
						</button>
					)}

					<button
						class={`button h-button is-danger is-outline is-elevated w-100 mt-4`}
						style={{ border: "none", fontWeight: "bold", padding: 20 }}
						onClick={close}
					>
					Go Back
					</button>
					
				</div>
			</div>
		</div>
	);
};

export const ResendOTP = ({ sending, resendOTP }) => {
	return (
		<h4 style={{ fontSize: 14, marginBottom: 10 }}>
			Didn't receive the OTP? {"  "}
			<a href="#" style={{ fontWeight: "bold" }} onClick={resendOTP}>
				{(sending && (
					<>
						RESENDING OTP{"  "}
						<a className="resend-button button h-button is-loading"></a>
					</>
				)) ||
					"RESEND OTP"}
			</a>
		</h4>
	);
};

export const EnterOTP = ({
	back,
	confirmOTP,
	sending,
	resendOTP,
	errorMessage,
}) => {
	const [otp, setOtp] = React.useState("");
	return (
		<div className="glass-box p-5">
			<div
				className="flex-cell is-bordered mt-3"
				style={{ textAlign: "center" }}
			>
				<i
					className="lnil lnil-lock-alt mb-5"
					style={{ fontWeight: "bold", fontSize: 40 }}
				/>
				<h3 style={{ fontSize: 18, fontWeight: "bold" }}>OTP Verification</h3>
				<h4 style={{ fontSize: 14 }}>
					We have sent a <strong>One Time Pin (OTP)</strong> to your mobile
					number.
				</h4>
				{errorMessage && (
					<div className="message is-danger mt-4">
						<div className="message-body">{errorMessage}</div>
					</div>
				)}

				<div style={{ marginTop: 25 }}>
					<h4 style={{ fontSize: 14, marginBottom: 10 }}>Please Enter OTP</h4>
					<div className="field has-addons">
						<div className="control is-expanded otp-input-pad">
							<OtpInput
								isInputNum={true}
								value={otp}
								onChange={(e) => {
									setOtp(e);
									if (e?.length === 6 && confirmOTP) confirmOTP(e);
								}}
								numInputs={6}
								containerStyle={{
									width: "100%",
								}}
								focusStyle={"otp-input-focus-style"}
								// separator={<span>-</span>}
							/>
						</div>
					</div>
					<ResendOTP sending={sending} resendOTP={resendOTP} />

					<button
						class="button h-button is-primary is-elevated w-100"
						style={{
							border: "none",
							fontWeight: "bold",
							padding: 20,
							marginTop: 20,
						}}
						onClick={back}
					>
						<i
							className="lnil lnil-chevron-left mb-5"
							style={{ paddingTop: 20, marginRight: 20 }}
						/>
						Back
					</button>
				</div>
			</div>
		</div>
	);
};

export const OTPConfirmation = ({
	coin,
	rawPhone,
	setValidatedMobile,
	mobilePhone,
	setMobilePhone,
	close
}) => {
	const [loading, setLoading] = React.useState();
	const [view, setView] = React.useState(0);
	const [info, setInfo] = React.useState({});
	const [validMobile, setValidMobile] = React.useState();
	const [otpdata, setOtpData] = React.useState({});
	const [phoneNumber, setphoneNumber] = React.useState();
	const [resending, setResending] = React.useState();
	const [errorMessage, setErrorMessage] = React.useState();

	const resendOTP = () => {
		getOTP(phoneNumber, true);
	};

	const getOTP = (mobile, resending = false) => {
		setphoneNumber(mobile);
		if (resending) setResending(true);
		else setLoading(true);
		api
			.post(
				{ phone_number: formatPhoneNumberInt(mobile) },
				"/verification/phone/register",
			)
			.then((res) => {
				if (res?.session_token) {
					// storeObject({ name: "token", value: res?.session_token })
					let d = {
						...otpdata,
						session_token: res?.session_token,
						phone_number: formatPhoneNumberInt(mobile), // "+"+mobile
					};
					setOtpData({ ...d });
					storeObject({ name: "mobile_verification_data", value: d });
					setView(1);
				} else {
				}
				setLoading(false);
				setResending(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	const confirmOTP = (otp) => {
		setInfo({
			message: "Confirming OTP, please wait...",
			status: "processing",
		});
		setLoading(true);
		// Confirm OTP Code
		api
			.post({ ...otpdata, security_code: otp }, "/verification/phone/verify")
			.then((res) => {
				if (res?.message === "Security code is valid.") {
					setErrorMessage(res?.message)
					setValidMobile(otpdata?.phone_number);
					setValidatedMobile(otpdata?.phone_number);
				} else {
					setErrorMessage(processError(res));
				}
				setLoading(false);
			})
			.catch((err) => {
				setInfo({
					message: "Invalid OTP entered, please try again.",
					status: "failed",
				});
				setLoading(false);
				setErrorMessage(processError(err));
			});
	};

	if (view === 1) {
		if (loading) {
			return (
				<div className="glass-box p-5">
					<div
						className="flex-cell is-bordered mt-3"
						style={{ textAlign: "center" }}
					>
						<KPLoader
							{...info}
							image={coin?.coin}
							restartProcess={() => setView(0)}
						/>
					</div>
				</div>
			);
		}
		return (
			<EnterOTP
				confirmOTP={confirmOTP}
				back={() => setView(0)}
				loading={loading}
				sending={resending}
				resendOTP={resendOTP}
				errorMessage={errorMessage}
				close={close}
			/>
		);
	}
	return (
		<RequestOTP
			errorMessage={errorMessage}
			getOTP={getOTP}
			loading={loading}
			mobilePhone={mobilePhone || rawPhone}
			setMobilePhone={setMobilePhone}
			close={close}
		/>
	);
};

const TransferPay = (props) => {
	const {
		confirm,
		refresh,
		setMobilePhone,
	} = props;
	const rawPhone = props?.data?.data?.phone;
	const coin = props?.data?.paymentCoin || {};
	const paymentStatus = props?.data?.paymentStatus
	const validatedMobile = props?.data?.validatedMobile;
	const [view, setView] = React.useState(0);
	const [otpview, setOtpview] = React.useState(false);
	const navigate = useNavigate()
	const socket = new Socket()

	const setValidatedMobile = (m) => {
		props.updateData({ validatedMobile: m })
	}

	const messageHandler = (message) => {
		console.log("Received", message) 
		if(message?.message?.identifier){
			props.updateData({ paymentStatus: message?.message });
			if([1,0].includes(message?.message?.status)){
				navigate("/confirmation-view")
			}
		}
	}

	const indicatePaid = () => {
		setView(1);
		if(socket) socket.reconnect()
	}

	React.useEffect(() => {
		if (validatedMobile) setOtpview(false);
	}, [validatedMobile]);


	React.useEffect(() => {
		if(!coin?.coin) navigate("/")
		else socket.init({ identifier: props?.data?.transactionId, messageHandler });
		return () => {
			socket && socket.close()
		}
	}, []);

	return (
		<KryptonPayCheckout>
			<div className="field">
				<div className="control">
					{/* {otpview && (
						<OTPConfirmation
							rawPhone={rawPhone}
							setMobilePhone={setMobilePhone}
							coin={coin}
							setValidatedMobile={(m) => setValidatedMobile(m)}
						/>
					)} */}

					<div className={`l-card ${otpview && "bg-blur"}`}>
						<div className="media-flex-center">
							<div className="h-icon x-large is-large is-rounded">
								<img
									style={{ minWidth: 70, height: 70 }}
									src={`images/coins/${(coin.coin || "").toLowerCase()}.png`}
									alt
								/>
							</div>

							<div className="flex-meta w-100 ml-5">
								<h4 style={{ marginBottom: 10, fontSize: 12 }}>
									Send the exact amount:{" "}
								</h4>
								<div
									style={{
										marginBottom: 10,
										display: "flex",
										alignItems: "flex-end",
									}}
								>
									<div style={{ width: `calc(100% - 25px)` }}>
										<span>Amount</span>
										<div style={{ fontSize: 16, overflowWrap: "break-word" }}>
											{coin.amount} {coin.coin} {" "}
											{view === 0 && (
												<small style={{ fontWeight: "bold", marginLeft: 15 }}>
													<ClockTiker
														key={v4()}
														main={true}
														styles={{}}
														updatePrice={true}
														// callback={refresh}
														customWrapper={true}
													/>
												</small>
											)}
										</div>
									</div>
									<CopyText icon={"copy"} text={coin.amount} />
								</div>
								<div
									style={{
										display: "flex",
										alignItems: "flex-end",
									}}
								>
									<div style={{ width: `calc(100% - 25px)` }}>
										<span>Rate</span>
										<div style={{ fontSize: 16, overflowWrap: "break-word" }}>
										{coin?.coin} 1 ={" "}{toMoney(coin?.rate, coin?.fiat_currency + " ")}
										</div>
									</div>
								</div>
								
							</div>
						</div>
						<hr/>
						<div style={{ display: "block" }}>
									<CopyText icon={"copy"} text={coin?.address} />
									<div style={{ width: `calc(100% - 25px)` }}>
										<span>
											To this {coin?.name}({coin?.coin}) Address:
										</span>
										<div style={{ fontWeight: "bold", fontSize: 16, overflowWrap: "break-word" }}>{coin?.address}</div>
										{/* <span>{shorten(coin?.address)}</span> */}
									</div>
									{view === 0 && (
										<div className="w-100">
										<button
											onClick={() => { navigate("/") }}
											className="button is-danger h-button is-elevated no-border"
											style={{ fontWeight: "bold", marginTop: 10, width: '30%', marginRight: 10 }}
											dangerouslySetInnerHTML={{ __html: getIcon("chevron-left") +" BACK" }}
										/>
										<button
											onClick={() => indicatePaid()}
											className="button is-primary h-button is-elevated no-border"
											style={{ fontWeight: "bold", marginTop: 10, width: '67%' }}
										>
											I HAVE SENT {coin.coin}
										</button>
										</div>
									)||(
										<hr/>
									)}
								</div>
						{/* <hr style={{ marginTop: 15, marginBottom: 0 }} /> */}
						{view === 0 && (
							<div className="media-flex-center mt-3">
								<style>
									{`
										.is-squared.qr-code svg{
											width: 90px !important;
											height: 90px !important;
											margin: 5px !important;
											margin-top: 15px !important;
											border-radius: 0px !important;
										}
									`}
								</style>
								<div
									className="h-icon x-large is-large is-squared qr-code "
									style={{ 
										minWidth: 90, height: 90, marginRight: 15, marginTop: 15, 
										borderRadius: 0,
										background: props?.data?.mode === "dark" ? "#323236" : "#fff",
										border: `1px solid ${props?.data?.mode === "dark" ? "#9898a0" : "#000"}`
									 }}
								>
									<QRCode 
										bgColor={props?.data?.mode === "dark" ? "#323236" : "#fff"} 
										fgColor={props?.data?.mode === "dark" ? "#9898a0" : "#000"} 
										size={80} 
										value={`${coin?.address}`} 
									/>
								</div>
								<style>
									{`.instruc {
										font-size: 12.5px !important;
									}
									.media-flex-center.qr-code svg {
										width: 80px !important;
										height: 80px !important;
									}
									`}
								</style>
								<div
									className="instruc"
									style={{
										textAlign: "justify",
										marginTop: 10,
									}}
								>
									Make sure you send {coin.coin} within 10 minutes. Afterwards
									the rate will be refreshed and you will have to use the new
									amount.
									 Once transfer is completed please 
									 click I've Sent {coin?.coin}, and we will verify your payment. Thank You!
								</div>
								<div>
								
							</div>
							</div>
						)}
						{(view === 0 && (
							<div/>
						)) || (
							<div>
								<p style={{ fontSize: 14, textAlign: "center", marginTop: 15 }}>
									Krypton Pay is waiting to receive your {coin.coin}. Please be
									patient, this may take upto 10mins or more.
									{paymentStatus && (
										<>
										<hr/>
										<p>{paymentStatus?.message}</p>
										</>
									)}
									<button
										className={`resend-button button h-button is-loading mt-2 ml-3`}
									/>
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
			</KryptonPayCheckout>
	);
};

// TBFrXN9ammNfFWCSxUgnb43PKRDGn149kV
// TBFrXN9ammNfFWCSxUgnb43PKRDGn149kV


const mapStateToProps = (state) => {
	return { data: state.data };
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateData: (e) => dispatch(updateData(e)),
		continuousConfirmation: (e) => dispatch(continuousConfirmation(e)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TransferPay);



