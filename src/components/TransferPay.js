/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-mixed-operators */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { processError, storeObject, toMoney } from "../utils/Functions";
import ClockTiker from "./others";
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
	const [otpview, setOtpview] = React.useState(true);

	const navigate = useNavigate();

	const setValidatedMobile = (m) => {
		props.updateData({ validatedMobile: m })
	}

	const indicatePaid = () => {
		setView(1);
		props.continuousConfirmation(res => {
			if (res?.terminate) navigate("/confirmation-view")
		})
	}

	React.useEffect(() => {
		if (validatedMobile) setOtpview(false);
	}, [validatedMobile]);

	return (
		<KryptonPayCheckout>
			<div className="field">
				<div className="control">
					{otpview && (
						<OTPConfirmation
							rawPhone={rawPhone}
							setMobilePhone={setMobilePhone}
							coin={coin}
							setValidatedMobile={(m) => setValidatedMobile(m)}
						/>
					)}

					<div className={`l-card ${otpview && "bg-blur"}`}>
						<div className="media-flex-center">
							<div className="h-icon x-large is-large is-rounded">
								<img
									style={{ minWidth: 70, height: 70 }}
									src={`images/coins/${(coin.coin || "").toLowerCase()}.png`}
									alt
								/>
							</div>

							<div className="flex-meta w-100">
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
										<div style={{ fontSize: 16, fontWeight: "bold", overflowWrap: "break-word" }}>
											{coin.amount} {coin.coin}
										</div>
									</div>
									<CopyText icon={"copy"} text={coin.amount} />
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
								</div>
						<hr />
						{view === 0 && (
							<div className="media-flex-center">
								<div
									className="flex-meta"
									style={{
										width: `calc(100% - 120px)`,
										marginLeft: 0,
										paddingRight: 10,
									}}
								>
									<div>
										<span>Exchange Rate:</span>
										<span>
											{coin?.coin} 1 ={" "}
											{toMoney(coin?.rate, coin?.fiat_currency + " ")}
										</span>
									</div>
									<ClockTiker callback={refresh} />
									<button
										onClick={() => indicatePaid()}
										className="button h-button is-elevated w-100"
										style={{ fontWeight: "bold", marginTop: 10 }}
									>
										I HAVE SENT {coin.coin}
									</button>
								</div>
								<div
									className="h-icon x-large is-large is-squared qr-code"
									style={{ width: 120, height: 120 }}
								>
									<QRCode size={115} value={`${coin?.address}`} />
								</div>
							</div>
						)}
						{(view === 0 && (
							<div>
								<p
									style={{
										fontSize: 11,
										textAlign: "justify",
										marginTop: 10,
										fontWeight: "bold",
									}}
								>
									Make sure you send {coin.coin} within 10 minutes. Afterwards
									the rate will be refreshed and you will have to use the new
									amount.
									 Once you made the transfer please copy your
									transaction ID (hash) & click the button above.
								</p>
							</div>
						)) || (
							<div>
								<p style={{ fontSize: 14, textAlign: "center" }}>
									{/* <div className="has-loader has-loader-active" style={{ height: 150, width: 150 }}>
									<KPSpinner image={coin.coin} />
									</div> */}
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
									></button>

									{/* Please copy and paste the Transaction ID (TxID or Hash) in the
									field above and click the check icon to complete your payment. */}
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



