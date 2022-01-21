import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateData, updatePrices } from "../Redux/Data/actions";
import { getIcon, toMoney } from "../utils/Functions";
import KryptonPayCheckout from "./KryptonPayCheckout";

// { coin = { coin: "usdt" }, restartProcess, changeViewTitle }

export const ValidatedInput = (props) => {
	const [validate, setValidate] = React.useState()
	return (
		<div className={`field ${props?.className||""}`}>
			<div className={`control is-expanded has-icon ${validate ? `has-validation has-${validate?.status?"success":"error"}` : ""}`}>
				<input
					type={props?.type || "text"}
					className="input"
					placeholder={props.label}
					defaultValue={props.value}
					onInput={(e) => {
						props?.callback && props?.callback(e);
						const valid = props?.validate && props?.validate(e?.target?.value);
						setValidate(valid);
						if(valid) props?.setChecks(valid?.status)
					}}
				/>
				
				<div className="form-icon" style={{ height: "100%" }} dangerouslySetInnerHTML={{ __html: getIcon(props.icon) }} />
				
				{validate && (
					<div className={`validation-icon is-${validate?.status ? "success" : "error"}`} 
						style={{ height: "100%" }}	
					dangerouslySetInnerHTML={{ __html: getIcon(validate?.status ? "check" : "x") }} />	
				)}
			</div>
			{validate?.message && (
				<p className={`help ${validate?.status? "success":"danger"}-text`}>{validate?.message}</p>
			)}
			{props?.rightAddon && props?.rightAddon()}
		</div>
	);
}

const HomePay = (props) => {
	const coin = props?.paymentCoin;
	const paymentStatus = props?.paymentStatus;
	const defaultMsg = "Processing your payment, please wait...";
	const [enableButton, setEnableButton] = React.useState(true);
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

const [checks, setChecks] = React.useState({});

const isValidated = () => {
	console.log(checks)
	if(checks?.amount  && checks?.name && checks?.phone) return true;
	return false;
}

const form = [
	{
		name: "amount",
		label: "Amount in Naira",
		icon: "shopping-cart",
		type: "number",
    	value: initialdata?.amount,
		validate: e => {
			if(Number(e) >= 5000){
				return { status: true, message: "" }
			}
			return { status: false, message: `Amount must be at least ${toMoney(5000)}` }
		}
	},
	{
		isLine: true,
	},
	{
		name: "name",
		label: "Name",
		icon: "user",
    	value: initialdata?.name,
		validate: e => {
			if(e?.length >= 2){
				return { status: true, message: "" }
			}
			return { status: false, message: `Please enter your name` }
		}
	},
	{
		name: "phone",
		label: "Phone",
		icon: "phone",
		type: "tel",
    	value: initialdata?.phone,
		validate: e => {
			if(e?.length >= 11 && e?.length <= 14){
				return { status: true, message: "" }
			}
			return { status: false, message: `Please enter a valid phone number` }
		}
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
								<ValidatedInput 
									{...e}
									callback={(evt) =>  {
										updateData({ [e.name]: evt.target.value });
										if(e.name === "phone") props.updateData({ validatedMobile: evt.target.value });
									}}
									setChecks={valid => {
										const d = { [e.name] : valid }
										setChecks({ ...checks, ...d })
									}}
								/>
							)
						})}

						<button className="button h-button is-primary is-elevated w-100 mt-2 no-border"
              onClick={() => {
				  if(isValidated()) startPayment()
			  }}
			  disabled={!isValidated()}
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
