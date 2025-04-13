import React from "react";
import PropTypes from "prop-types";

const FloatingButton = ({
	icon,
	onClick,
	position = "bottom-right",
	color = "#4CAF50",
	size = "56px",
	text,
	disabled = false,
}) => {
	const buttonStyle = {
		backgroundColor: color,
		width: size,
		height: size,
		borderRadius: "50%",
	};

	const containerStyle = {
		...positions[position],
	};

	return (
		<div className="floating-button-container" style={containerStyle}>
			<button
				className="floating-button"
				style={buttonStyle}
				onClick={onClick}
				disabled={disabled}
				aria-label={text || "Floating action button"}
			>
				{icon || (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="white"
					>
						<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
					</svg>
				)}
			</button>
			{text && <span className="floating-button-text">{text}</span>}
		</div>
	);
};

// Position presets
const positions = {
	"bottom-right": {
		bottom: "20px",
		right: "20px",
	},
	"bottom-left": {
		bottom: "20px",
		left: "20px",
	},
	"top-right": {
		top: "20px",
		right: "20px",
	},
	"top-left": {
		top: "20px",
		left: "20px",
	},
	center: {
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
	},
};

FloatingButton.propTypes = {
	icon: PropTypes.node,
	onClick: PropTypes.func.isRequired,
	position: PropTypes.oneOf([
		"bottom-right",
		"bottom-left",
		"top-right",
		"top-left",
		"center",
	]),
	color: PropTypes.string,
	size: PropTypes.string,
	text: PropTypes.string,
	disabled: PropTypes.bool,
};

export default FloatingButton;
