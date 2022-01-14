import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateData, updateValidatedPhone, updatePaymentAddress } from "../Redux/Data/actions";
import KryptonPayCheckout from "./KryptonPayCheckout";
import { OTPConfirmation } from "./TransferPay";

const CoinPicker = (props) => {
	const { updateData, updatePaymentAddress } = props;
	const navigator = useNavigate();
	const [otpview, setOtpview] = React.useState()
	const coins = props.data?.initialize?.coins || [];
	const rawPhone = props?.data?.data?.phone;
	const coin = props?.data?.paymentCoin || {};
	const validatedMobile = props?.data?.validatedMobile;

	const setValidatedMobile = (m) => {
		props.updateData({ validatedMobile: m });
		props.updateValidatedPhone({ validatedMobile: m }, (res) => {
			navigator("/transafer-pay")
		})
	}

	const proceed = ({ coin }) =>{
		updateData({ selectedCoin: coin });
		if (!validatedMobile){
			setOtpview(true);
			return;
		}
		props.updateValidatedPhone({ validatedMobile, coin }, (res) => {
			navigator("/transafer-pay");
		})
	}

	const setMobilePhone = (m) => {
		props.updateData({ data: { ...props?.data?.data, phone: m } });
	}

	const updatePhone = (i) => {
		updateData({ info: { message: "Getting wallet address...", status: "processing" } })
		updatePaymentAddress(
			{ index: i, selectedCoin: coin, pageTitle: "Make a Payment" },
			(status) => {
				if (status) navigator("/transafer-pay");
			},
		);
	}

	return (
		<KryptonPayCheckout>
			{otpview && (
						<view style={{
							position: "absolute",
							top: 150,
							left: 0,
							right: 0,
							bottom: 0,
						}}>
							<OTPConfirmation
								rawPhone={rawPhone}
								setMobilePhone={setMobilePhone}
								coin={coin}
								setValidatedMobile={(m) => setValidatedMobile(m)}
								close={() => setOtpview(false)}
							/>
						</view>
					)}
			<div className={`columns is-multiline ${otpview && "bg-blur"}`} 
				 style={{ display: "flex" , minHeight: otpview ? 300: "inherit" }}>
					{/* <div className={`l-card ${otpview && "bg-blur"}`}></div> */}
				{coins.map((coin, i) => {
					return (
						<div
							className={`crypto-button h-button column`}
							key={"coin-list-" + i}
							style={{
								paddingBottom: 0,
								paddingRight: i % 2 === 0 && `${0.75 / 2}rem`,
								paddingLeft: i % 2 !== 0 && `${0.75 / 2}rem`,
								width: "50%",
							}}
							onClick={() => proceed({ index: i, coin })}
						>
							<div className="l-card" style={{ padding: 10, borderRadius: 5 }}>
								<div className="media-flex-center">
									<div
										className="h-icon is-info is-rounded"
										style={{ minWidth: 35, width: 35, height: 35 }}
									>
										<img
											className="crypto-icon"
											style={{ width: 35, height: 35 }}
											src={`images/coins/${(
												coin.coin || ""
											).toLowerCase()}.png`}
											alt="img"
										/>
										<img
											className="crypto-icon-black"
											style={{ width: 35, height: 35 }}
											src={`images/coins/${(
												coin.coin || ""
											).toLowerCase()}-b.png`}
											alt="img"
										/>
									</div>
									<div className="flex-meta">
										<span>{coin.coin}</span>
										<span>{coin.amount_8}</span>
									</div>
									<div className="flex-end"></div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</KryptonPayCheckout>
	);
};

const mapStateToProps = (state) => {
	return { 
		data: state.data
	 };
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateData: (e) => dispatch(updateData(e)),
		updatePaymentAddress: (e, c) => dispatch(updatePaymentAddress(e, c)),
		updateValidatedPhone: (e, c) => dispatch(updateValidatedPhone(e, c)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CoinPicker);
