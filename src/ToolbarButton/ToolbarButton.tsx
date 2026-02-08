import "./ToolbarButton.css";

// Define Interface for ToolbarButtonProps
// Note - Icon is optional, name and onClick callback are not
interface ToolbarButtonProps {
	icon?: string;
	label: string;
	bgColor: string;
	onClick: () => void;
}

// Modular component for adding general functionality to the GameBoard toolbar
const ToolbarButton = (props: ToolbarButtonProps) => {
	return (
		<button
			className={`toolbarButton ${props.bgColor}`}
			onClick={props.onClick}>
			<p className={"toolbarText"}>{props.label}</p>
			{props.icon && <img src={props.icon} className="toolbarImg" />}
		</button>
	);
};

export default ToolbarButton;
