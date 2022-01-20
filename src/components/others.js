import React from "react";
import Countdown from "react-countdown";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { updateData, updatePrices, updateValidatedPhone } from "../Redux/Data/actions";

const ClockTiker = ({
	styles = { border: "none", marginTop: 6 },
	customWrapper = false,
	duration = 600,
	updatePrices,
	updateData,
	main,
	updatePrice,
	next_refresh,
	updateValidatedPhone
}) => {
	const navigate = useNavigate();
	const counter = React.useRef(null);
	const renderer = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			if(updatePrice) {
				updateValidatedPhone({ forceUpdate: true }, (res) => {   });
			}
			return <button className={`resend-button button h-button is-loading ml-2`}/>;
		} else {
			return (<>{minutes}min {seconds}sec</>);
		}
	};

	if (customWrapper){
		return (
			<Countdown
				ref={counter}
				key={v4()}
				date={next_refresh}
				renderer={renderer}
			/>
		);
	}else{
		return (
			<button
				className="button h-button w-100 is-success is-squared is-elevated"
				style={styles}
			>
				<span style={{ color: "#fff" }}>
					<small>Expires in</small>{" "}
					<Countdown
						ref={counter}
						key={v4()}
						// date={Date.now() + duration * 1000}
						date={next_refresh}
						renderer={renderer}
					/>
				</span>
			</button>
		);
	}

};

const mapStateToProps = (state) => {
	return { duration: state?.data?.duration || 0, next_refresh: state?.data?.next_refresh };
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateData: (e) => dispatch(updateData(e)),
		updatePrices: (e, c) => dispatch(updatePrices(e, c)),
		updateValidatedPhone: (e, c) => dispatch(updateValidatedPhone(e, c)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ClockTiker);
