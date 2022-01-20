import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateData, updatePrices } from "../Redux/Data/actions";
import { getIcon } from "../utils/Functions";
import KryptonPayCheckout from "./KryptonPayCheckout";

// { coin = { coin: "usdt" }, restartProcess, changeViewTitle }


const HomePay = (props) => {
	const coin = props?.paymentCoin;
	const paymentStatus = props?.paymentStatus;
	const defaultMsg = "Processing your payment, please wait...";
	const [status, setStatus] = React.useState("processing");
	const [message, setMessage] = React.useState(defaultMsg);
  const navigate = useNavigate();
  const initialdata = props?.data?.data;

  const startPayment = () => {
    const business = props?.data?.business;
    const d = { ...props?.data?.data, key: business.key };
			props.updateData({ info: { message: "Initializing...", status: "processing" } })
			props.updateData({ data:  d });
			props.updatePrices(d, (res) => { navigate("/"); });
  }

	const updateData = (e) => {
		props.updateData({ data: { ...props?.data?.data, ...e } });
	};

	const onContinue = () => {
		window.parent.postMessage(
			{ action: "successpayment", data: {}, krypton_pay: true },
			"*",
		);
	};

	const restartProcess = () => {
		window.parent.postMessage(
			{
				action: paymentStatus?.status ? "successpayment" : "failedpayment",
				data: paymentStatus,
				krypton_pay: true,
			},
			"*",
		);
	};

  React.useEffect(() => {
    props.updateData({ nonIntegrated: true });
  }, [])


const form = [
	{
		name: "amount",
		label: "Amount in Naira",
		icon: "shopping-cart",
		type: "number",
    value: initialdata?.amount
	},
	{
		isLine: true,
	},
	{
		name: "name",
		label: "Name",
		icon: "user",
    value: initialdata?.name
	},
	{
		name: "phone",
		label: "Phone",
		icon: "phone",
    value: initialdata?.phone
	},
];
  


	return (
		<KryptonPayCheckout nonIntegrated fullscreen>
			<style>
				{`
          .control.has-icon .input {
            padding-left: 42.5px !important;
            height: 45px;
            padding-right: 13px;
          }
        `}
			</style>
			<div className="field mt-4">
				<p style={{ marginBottom: 15 }}>
					Please complete the form below to start payment.
				</p>
				<div className="control">
					<div className="l-card">
						{form.map((e) => {
							if (e.isLine) {
								return (
									<div className="field">
										<hr />
									</div>
								);
							}
							return (
								<div className="field">
									<div className="control has-icon">
										<input
											type={e.type || "text"}
											className="input"
											placeholder={e.label}
                      defaultValue={e.value}
											style={{ paddingLeft: 50 }}
											onInput={(evt) =>  {
                          updateData({ [e.name]: evt.target.value });
                          if(e.name === "phone") props.updateData({ validatedMobile: evt.target.value });
											}}
										/>
										<div
											className="form-icon mt-1 ml-1"
											dangerouslySetInnerHTML={{ __html: getIcon(e.icon) }}
										/>
									</div>
								</div>
							);
						})}

						<button className="button h-button is-primary is-elevated w-100 mt-2 no-border"
              onClick={() => startPayment()}
            >
							<span>Proceed</span>
							<span
								className="icon"
								dangerouslySetInnerHTML={{ __html: getIcon("arrow-right") }}
							/>
						</button>
					</div>
				</div>
			</div>
		</KryptonPayCheckout>
	);
};

const mapStateToProps = (state) => {
	return { ...state };
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateData: (e) => dispatch(updateData(e)),
		updatePrices: (e, c) => dispatch(updatePrices(e, c)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePay);
