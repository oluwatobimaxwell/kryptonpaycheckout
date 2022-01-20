/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { SvgIcon } from "./SvgIcon";
import { getIcon, toMoney } from "../utils/Functions";
import ReactToPrint from "react-to-print";

export const KPSpinner = ({ image }) => {
	return (
		<div className="h-loader-wrapper">
			<div style={{ position: "absolute" }}>
				<img
					className="breathing"
					style={{ minWidth: 75, height: 75 }}
					src={
						image
							? `images/coins/${(image || "").toLowerCase()}.png`
							: require("../assets/images/kp-icon.png").default
					}
					alt
				/>
			</div>

			<div
				style={{
					width: 165,
					height: 165,
					borderRadius: 80,
					border: "1px solid #a9a9b2",
					position: "absolute",
				}}
			/>
			<div className="loader is-xl is-loading" style={{ width: 1 }}>
				<div
					style={{
						width: 20,
						height: 20,
						borderRadius: 10,
						background: "#a9a9b2",
						float: "left",
						marginLeft: -10,
					}}
				></div>

				<div
					style={{
						width: 10,
						height: 10,
						borderRadius: 10,
						background: "#a9a9b2",
						float: "right",
					}}
				></div>
			</div>
		</div>
	);
};

export const InvoicePrint = (props) => {
	const lines = [
		{ name: "Vendor Code", value: props?.merchant?.account_number },
		{ name: "Vendor Name", value: props?.merchant?.name },
		// { isLine: true },
		{ name: "Amount", value: toMoney(props?.amount_fiat, props?.currency_fiat) },
		{ name: "Crypto Amount", value: toMoney(props?.amount_crypto, props?.currency_crypto) },
		{ name: "Reference", value: props?.reference },
		{ name: "TXiD", value: props?.txid },
		{ name: "Message", value: props?.message+". "+props?.note },
		{ name: "Identifier", value: props?.identifier },
	];
	return (
		<>
			<style>
				{`
  .control.has-icon .input {
	padding-left: 42.5px !important;
	height: 45px;
	padding-right: 13px;
  }

  .print-left {
	width: 40%;
	font-weight: bold;
}

  .print-right {
	  width: 60%;
  }

  .field {

  }
`}
			</style>
			<div className="field mt-4">
				<p style={{ marginBottom: 15 }}>
					Please complete the form below to start payment.
				</p>
				<div className="control">
					<div className="l-card">
						{lines.map((e, i) => {
							return (
								<>
								<div className="field" style={{ display: "flex" }}>
									<p className="print-left">{e.name}:</p>
									<p className="print-right">{e.value}</p>
								</div>
								{i < lines.length - 1 && <hr />}
								</>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export const KPLoader = ({
	image = null,
	restartProcess,
	noControls = true,
	message = "Processing, please wait...",
	status = "processing",
	onContinue,
	paymentStatus = {},
	merchant = {}
}) => {
	const statusImage = () => {
		switch (status.toLowerCase()) {
			case "success":
				return require("../assets/images/checked.png").default;
			case "failed":
				return require("../assets/images/cancel.png").default;
			default:
				return require("../assets/images/exclamation.png").default;
		}
	};

	const printElement = React.useRef(null);

	return (
		<div ref={printElement}>
			<div
				className={`media-flex-center is-raised demo-l-card ${
					status === "processing" ? "has-loader has-loader-active" : ""
				} `}
				style={{ minHeight: 250, marginBottom: 0 }}
			>
				{(status === "processing" && <KPSpinner image={image} />) || (
					<div style={{ width: "max-content", margin: "auto" }}>
						<img
							className="breathing"
							style={{ minWidth: 150, height: 150 }}
							src={statusImage()}
							alt
						/>
					</div>
				)}
			</div>
			<style>
				{`
					.message-p {
						font-size: 16px !important;
						text-align: center;
						font-weight: normal;
					}
				`}
			</style>
			<p className="message-p" dangerouslySetInnerHTML={{ __html: message }} />
			{status !== "processing" && noControls && (
				<div
					className="is-centered"
					style={{ width: "max-content", margin: "auto", marginTop: 10 }}
				>
					{status !== "success" && (
						<button
							onClick={restartProcess}
							className="button h-button"
							style={{ marginRight: 10 }}
						>
							<span className="icon">
								<SvgIcon name={"refresh"} />
							</span>
							<span>Retry</span>
						</button>
					)}
				</div>
			)}
			{paymentStatus?.identifier && (
				<>
				<InvoicePrint {...paymentStatus} merchant={merchant} />
	
				<ReactToPrint
					trigger={() => (
						<button className="button h-button w-100">
							<span>Print Invoice</span>
							<span
								className="icon"
								dangerouslySetInnerHTML={{ __html: getIcon("printer") }}
							/>
						</button>
					)}
					content={() => printElement.current}
					documentTitle={paymentStatus?.crypto_pair +"-"+ paymentStatus?.reference}
				/>
				</>
			)}
		</div>
	);
};
