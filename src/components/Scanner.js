import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateData, updatePrices } from "../Redux/Data/actions";
import { getIcon } from "../utils/Functions";
import KryptonPayCheckout from "./KryptonPayCheckout";
import QrReader from 'react-qr-scanner'
import { Api } from "../classes/Api";

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
	facingMode={"rear"}
	delay={100}
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
	const [status, setStatus] = React.useState("processing");
	const [businessId, setBusinessId] = React.useState(business_id);
	const [loading, setLoading] = React.useState(false);
	const navigate = useNavigate()

  const startPayment = async () => {
	setLoading(true);
	const res = await api.get({}, `/business/${businessId}/getbusiness`);
	if(res?.identifier){
		props.updateData({ business: res });
		setLoading(false);
		navigate(`/pay/${businessId}`)
	}
  }


const [form, setForm] = React.useState([
	{
		name: "amount",
		label: "Vendor ID",
		icon: "briefcase",
		type: "text",
    	value: businessId || ""
	}
])

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
	}
}
  


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
								<div className="field has-addons">
									<div className="control has-icon is-expanded">
										<input
											type={e.type || "text"}
											className="input"
											placeholder={e.label}
                      defaultValue={e.value}
											style={{ paddingLeft: 50 }}
											onInput={(evt) =>  {
												setBusinessId(evt.target.value);
											}}
										/>
										<div
											className="form-icon mt-1 ml-1"
											dangerouslySetInnerHTML={{ __html: getIcon(e.icon) }}
										/>
									</div>
									<div class="control" stylr={{ height: 45 }}>
              <a class="button is-primary" style={{ height: "100%" }}
			  	onClick={() => attachScanner()}
			  >
				  <i className="mdi mdi-qrcode-scan " style={{ fontSize: 18 }} />
              </a>
          </div>
								</div>
							);
						})}

						<button className={`button h-button is-primary is-elevated w-100 mt-2 no-border ${loading ? "is-loading":""}`}
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
