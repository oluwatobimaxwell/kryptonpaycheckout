import React from "react";
import Countdown from "react-countdown";

export const ClockTiker = ({
	styles = { border: "none", marginTop: 6 },
	callback,
	customWrapper = false,
  duration = 600
}) => {
	const renderer = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			callback && callback();
			// Render a completed state
			return "Price Expired";
		} else {
			// Render a countdown
			return (
				<>
					{minutes}min {seconds}sec
				</>
			);
		}
	};

	if (customWrapper)
		return <Countdown date={Date.now() + duration * 1000} renderer={renderer} />;

	return (
		<button
			className="button h-button w-100 is-success is-squared is-elevated"
			style={styles}
		>
			<span style={{ color: "#fff" }}>
				<small>Expires in</small>{" "}
				<Countdown date={Date.now() + duration * 1000} renderer={renderer} />
			</span>
		</button>
	);
};
