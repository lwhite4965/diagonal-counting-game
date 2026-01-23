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

	// This should help w undo functionality Jaden!!
	const [secondLastCellPlaced, setSecondLastCellPlaced] = useState<number[]>([
		-1, -1
	]);

	// Define Internal State for which "level" is active
	const [activeLevel, setActiveLevel] = useState<1 | 2>(1);

	// Define Internal State for Current Score
	const [score, setScore] = useState<number>(0);

	// Define Internal State for Error Messaging
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	// PLACE METHODS HERE

	// Define function for handling error, which, for now, is blank
	function handleError(msg: string): void {
		setErrorMsg(msg);
	}

	// Define function for processing a move in lvl 1 - accepts row column coordinates and cell type positionally
	function processLvl1Move(r: number, c: number, cellType: string): void {
		// NOTE: For now, all invalid inputs will be blocked via the empty "handleError" method

		// Error on accessing lvl 2 cell early
		if (cellType !== "grey") {
			handleError("Level 2 not yet unlocked.");
			return;
		}

		// Case where "1" is being placed
		if (nextToPlace == 1) {
			// Accept unconditionally
			setMatrix((prev) => {
				prev[r][c] = nextToPlace;
				return prev;
			});
			setNextToPlace((prev) => prev + 1);
			setSecondLastCellPlaced(lastCellPlaced);
			setLastCellPlaced([r, c]);
			return;
		}

		// Case where "2" through "25" is being placed
		// Source coordinates of last placed cell
		const lr = lastCellPlaced[0];
		const lc = lastCellPlaced[1];

		// Error on selecting non-adjacent cell
		if (Math.abs(r - lr) > 1 || Math.abs(c - lc) > 1) {
			handleError(
				"Cannot place number in non-adjacent cell during level 1."
			);
			return;
		}

		// Error on selecting filled cell
		if (matrix[r][c] !== 0) {
			handleError("Cannot place number in already filled cell.");
			return;
		}

		// Conditionally assign point
		if (Math.abs(r - lr) == 1 && Math.abs(c - lc) == 1) {
			setScore((prev) => prev + 1);
		}

		// If no error blocked placement - update matrix
		setMatrix((prev) => {
			prev[r][c] = nextToPlace;
			return prev;
		});

		// Conditionally activate level 2
		if (nextToPlace == 25) {
			setNextToPlace(2);
			setActiveLevel(2);
			setSecondLastCellPlaced(lastCellPlaced);
			setLastCellPlaced([r, c]);
			// Clear "-1" from lvl 2 cells
			setMatrix((prevMatrix) =>
				prevMatrix.map((row) => row.map((v) => (v === -1 ? 0 : v)))
			);
			return;
		}

		setNextToPlace((prev) => prev + 1);
		setSecondLastCellPlaced(lastCellPlaced);
		setLastCellPlaced([r, c]);
		setErrorMsg(null);
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
			<p className="helperText">Current Level: {activeLevel}</p>
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
								selected={
									rowCount == lastCellPlaced[0] &&
									cellCount == lastCellPlaced[1]
								}
							/>
						);
					})
				)}
			</div>
			<p className="helperText">
				{`Last Cell (debugging): ${lastCellPlaced}`}
			</p>
			<p className="helperText">
				{`2nd Last Cell (debugging): ${secondLastCellPlaced}`}
			</p>
			<p
				className={`errorText ${errorMsg ? "" : "hidden"}`}>{`Error: ${errorMsg}`}</p>
		</div>
	);
};

export default GameBoard;
