/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateData, updatePrices } from "../Redux/Data/actions";
import { getIcon } from "../utils/Functions";
import KryptonPayCheckout from "./KryptonPayCheckout";
import QrReader from 'react-qr-scanner'
import { Api } from "../classes/Api";
import { ValidatedInput } from "./HomePay";

// { coin = { coin: "usdt" }, restartProcess, changeViewTitle }
const api = new Api();

export const QRScanner = ({ callback }) => {
	const handleError = (e) => {
		console.log(e)
	}
	const handleScan = (e) => {
		if(e?.text){
			if(e?.text?.includes("http")) window.location = e?.text
			// else  callback && callback()
			else window.location = `/pay/${e?.text}`
		}
	}
	return <QrReader
				delay={1000}
				facingMode={"rear"}
				legacyMode={true}
				style={{
					height: 240,
					width: "100%",
					borderRadius: 5,
					padding: 10,
					background: "#000"
				}}
				onError={handleError}
				onScan={handleScan}
	/>
}


const Scanner = (props) => {
	const { business_id } = useParams();
	const coin = props?.paymentCoin;
	const paymentStatus = props?.paymentStatus;
	const defaultMsg = "Processing your payment, please wait...";
	const [status, setStatus] = React.useState();
	const [businessId, setBusinessId] = React.useState(business_id);
	const [loading, setLoading] = React.useState(false);
	const navigate = useNavigate()

  const startPayment = async () => {
	setLoading(true);
	const res = await api.get({}, `/business/${businessId}/getbusiness`);
	console.log(res)
	if(res?.identifier){
		props.updateData({ business: res });
		navigate(`/pay/${businessId}`)
	}else{
		setStatus(res?.message)
	}
	setLoading(false);
  }


const [form, setForm] = React.useState([
	{
		name: "vendor_id",
		label: "Vendor ID",
		icon: "briefcase",
		type: "text",
    	value: (businessId === "undefined" ? "" : businessId) || "",
		validate: e => {
			if(e?.length >= 5){
				return { status: true, message: "" }
			}
			return { status: false, message: `Vendor ID must be atleast 5 characters` }
		}
	}
])


const [checks, setChecks] = React.useState({});

const isValidated = () => {
	return checks?.vendor_id
}

const attachScanner = () => {
	const check = form.find(e => e.type === "scanner")
	if(!check){
		setForm([...form,
			{
		isLine: true
	},
	{
		type: "scanner"
	}
		])
	}else{
		setForm(form.filter(e => e.name === "vendor_id"))
	}
}


React.useEffect(() => {
	setChecks({
		vendor_id: form.find(e => e.name === "vendor_id").validate((businessId === "undefined" ? "" : businessId) || "").status,
	})
}, [])
  


	return (
		<>
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
				{status && (
					<div class="message is-danger">
					<div class="message-body">
						{status}
					</div>
				</div>
				)}
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
							
							if(e.type === "scanner") return <QRScanner callback={e => setBusinessId(e)} />
							return (
								<ValidatedInput 
									{...e}
									className="has-addons"
									callback={(evt) =>  {
										updateData({ [e.name]: evt.target.value });
										if(e.name === "phone") props.updateData({ validatedMobile: evt.target.value });
									}}
									setChecks={valid => {
										const d = { [e.name] : valid }
										setChecks({ ...checks, ...d })
									}}
									rightAddon={() => {
										return (
											<div class="control" stylr={{ height: 45 }}>
												<a
													class="button is-primary"
													style={{ height: "100%" }}
													onClick={() => attachScanner()}
												>
													<i
														className="mdi mdi-qrcode-scan "
														style={{ fontSize: 18 }}
													/>
												</a>
											</div>
										);
									}}
								/>
							)
							// return (
							// 	<div className="field has-addons">
							// 		<div className="control has-icon is-expanded">
							// 			<input
							// 				type={e.type || "text"}
							// 				className="input"
							// 				placeholder={e.label}
							// 				defaultValue={e.value}
							// 				style={{ paddingLeft: 50 }}
							// 				onInput={(evt) => {
							// 					setBusinessId(evt.target.value);
							// 				}}
							// 			/>
							// 			<div
							// 				className="form-icon mt-1 ml-1"
							// 				dangerouslySetInnerHTML={{ __html: getIcon(e.icon) }}
							// 			/>
							// 		</div>
							// 		<div class="control" stylr={{ height: 45 }}>
							// 			<a
							// 				class="button is-primary"
							// 				style={{ height: "100%" }}
							// 				onClick={() => attachScanner()}
							// 			>
							// 				<i
							// 					className="mdi mdi-qrcode-scan "
							// 					style={{ fontSize: 18 }}
							// 				/>
							// 			</a>
							// 		</div>
							// 	</div>
							// );
						})}

						<button className={`button h-button is-primary is-elevated w-100 mt-2 no-border ${loading ? "is-loading":""}`}
              onClick={() => startPayment()}
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
			</>
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

export default connect(mapStateToProps, mapDispatchToProps)(Scanner);
