import React from "react";
import Countdown from "react-countdown";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { updateData, updatePrices } from "../Redux/Data/actions";

const ClockTiker = ({
	styles = { border: "none", marginTop: 6 },
	customWrapper = false,
  duration = 600,
  updatePrices,
  updateData,
  main 
}) => {
	const navigate = useNavigate();
	const counter = React.useRef(null)

	const renderer = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			updateData({ info: { message: "Updating prices...", status: "processing" } })
			main  && updatePrices(null, (res) => {  navigate("/")  })
			return "Updating prices..."
		} else {
			// Render a countdown
			return (
				<>{minutes}min {seconds}sec</>
			);
		}
	};

	if (customWrapper)
		return <Countdown ref={counter} key={v4()} date={Date.now() + duration * 1000} renderer={renderer} />;

	return (
		<button
			className="button h-button w-100 is-success is-squared is-elevated"
			style={styles}
		>
			<span style={{ color: "#fff" }}>
				<small>Expires in</small>{" "}
				<Countdown ref={counter} key={v4()} date={Date.now() + duration * 1000} renderer={renderer} />
			</span>
		</button>
	);
};


const mapStateToProps = (state) => {
	return { duration: state?.data?.duration || 0 };
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateData: (e) => dispatch(updateData(e)),
		updatePrices: (e, c) => dispatch(updatePrices(e, c)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ClockTiker);
