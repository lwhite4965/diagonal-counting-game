import "./GameBoard.css";
import SingleCell from "../SingleCell/SingleCell";
import ToolbarButton from "../ToolbarButton/ToolbarButton";
import { getCellType } from "./helpers";
import { useState } from "react";
import testImage from "../assets/testImage.jpg";

// Interface that defines mandatory (?) props for the GameBoard component
// interface GameBoardProps {
// 	foo: number;
// }

// Define methods for gameboard here

// GameBoard instance - renders collection of SingleCells
const GameBoard = () => {
	// PLACE INTERNAL STATE HERE
	// Define Initial Matrix State
	const [matrix, setMatrix] = useState<number[][]>([
		[-1, -1, -1, -1, -1, -1, -1],
		[-1, 0, 0, 0, 0, 0, -1],
		[-1, 0, 0, 0, 0, 0, -1],
		[-1, 0, 0, 0, 0, 0, -1],
		[-1, 0, 0, 0, 0, 0, -1],
		[-1, 0, 0, 0, 0, 0, -1],
		[-1, -1, -1, -1, -1, -1, -1]
	]);

	// Define State for NextToPlace
	const [nextToPlace, setNextToPlace] = useState<number>(1);

	// Define Internal State for last cell placed
	const [lastCellPlaced, setLastCellPlaced] = useState<number[]>([-1, -1]);

	// Define Internal State for which "level" is active
	const [activeLevel /*setActiveLevel*/] = useState<1 | 2>(1);

	// Define Internal State for Current Score
	const [score /*setScore*/] = useState<number>(0);

	// PLACE METHODS HERE
	// Define function for processing a move in lvl 1 - accepts row column coordinates and cell type positionally
	function processLvl1Move(r: number, c: number, cellType: string): void {
		// Block clicks on lvl 2 cell clicks for now
		if (cellType !== "grey") {
			return;
		}

		// Very Naive Approach
		setMatrix((prev) => {
			prev[r][c] = nextToPlace;
			return prev;
		});
		setNextToPlace((prev) => prev + 1);
		setLastCellPlaced([r, c]);
	}

	// Define function for processing a move in lvl2 - accepts row column coordinates positionally
	// not touching this - just for architecture
	function processLvl2Move(r: number, c: number, cellType: string): void {
		console.log(r, c, cellType, "Lvl 2 not yet implemented");
	}

	// Return Grid of SingleCells, passing corresponding matrix value to each
	return (
		<div className="verticalParent">
			<div className="horizontalParent">
				<ToolbarButton
					label="foo"
					onClick={() => console.log("foo")}
					bgColor="green"
					icon={testImage}
				/>
				<ToolbarButton
					label="bar"
					onClick={() => console.log("bar")}
					bgColor="purple"
				/>
			</div>
			<p className="helperText">Current Score is: {score}</p>
			<p className="helperText">Next Number to Place is: {nextToPlace}</p>
			<div className="grid7x7">
				{matrix.map((row, rowCount) =>
					row.map((cellValue, cellCount) => {
						const currLoop = rowCount * 7 + cellCount;
						return (
							<SingleCell
								value={cellValue}
								cellType={getCellType(currLoop)}
								row={rowCount}
								column={cellCount}
								onClick={
									activeLevel == 1
										? processLvl1Move
										: processLvl2Move
								}
							/>
						);
					})
				)}
			</div>
			<p className="helperText">
				{`Last Cell (debugging): ${lastCellPlaced}`}
			</p>
		</div>
	);
};

export default GameBoard;
