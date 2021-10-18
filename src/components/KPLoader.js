/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { SvgIcon } from "./SvgIcon";


export const KPSpinner = ({ image }) => {
	return (
		<div className="h-loader-wrapper">
		<div style={{ position: "absolute" }}>
							<img
								className="breathing"
								style={{ minWidth: 75, height: 75 }}
								src={
									image ? `images/coins/${(image || "").toLowerCase()}.png` : "images/kp-icon.png"
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
	)
}


export const KPLoader = ({
	image = null,
	restartProcess,
	noControls = true,
	message = "Processing, please wait...",
	status = "processing",
    onContinue
}) => {
	const statusImage = () => {
		switch (status.toLowerCase()) {
			case "success":
				return "images/checked.png";
			case "failed":
				return "images/cancel.png";
			default:
				return "images/exclamation.png";
		}
	};
	return (
		<div>
			<div
				className={`media-flex-center is-raised demo-l-card ${
					status === "processing" ? "has-loader has-loader-active" : ""
				} `}
				style={{ minHeight: 250, marginBottom: 0 }}
			>
				{(status === "processing" && (
						<KPSpinner image={image} />
				)) || (
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
			<p
				style={{ fontSize: 11, textAlign: "center" }}
				dangerouslySetInnerHTML={{ __html: message }}
			/>
			{status !== "processing" && noControls  && (
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

					<button onClick={onContinue} className="button h-button">
						<span>Continue</span>
						<span className="icon">
							<SvgIcon name={"chevron-right"} />
						</span>
					</button>
				</div>
			)}
		</div>
	);
};
