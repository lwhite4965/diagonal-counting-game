import "./GameBoard.css";
import SingleCell from "../SingleCell/SingleCell";
import ToolbarButton from "../ToolbarButton/ToolbarButton";
import { getCellType, playSuccess, playFail } from "./helpers";
import { useState } from "react";
import downloadImg from "../assets/downloadImg.svg";
import uploadImg from "../assets/uploadImg.svg";

// GameBoard instance - renders collection of SingleCells
const GameBoard = () => {
	// PLACE INTERNAL STATE HERE
	// Define Initial Matrix State
	const initialMatrix = [
		[-1, -1, -1, -1, -1, -1, -1],
		[-1, 0, 0, 0, 0, 0, -1],
		[-1, 0, 0, 0, 0, 0, -1],
		[-1, 0, 0, 0, 0, 0, -1],
		[-1, 0, 0, 0, 0, 0, -1],
		[-1, 0, 0, 0, 0, 0, -1],
		[-1, -1, -1, -1, -1, -1, -1]
	];
	const [matrix, setMatrix] = useState<number[][]>(initialMatrix);

	// Define State for NextToPlace
	const [nextToPlace, setNextToPlace] = useState<number>(1);

	// Define Internal State for Cell Placement history
	const [cellPlacementHistory, setCellPlacementHistory] = useState<number[][]>([]);

	// Define Internal State for which "level" is active
	const [activeLevel, setActiveLevel] = useState<1 | 2>(1);

	// Define Internal State for Current Score
	const [score, setScore] = useState<number>(0);

	// Define Internal State for Error Messaging
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	// PLACE METHODS HERE

	// Function to save jsonified game state to client computer
	function saveGame(): void {
		// get snapshot of state
		const stateSnapshot = {
			matrix,
			nextToPlace,
			cellPlacementHistory,
			activeLevel,
			score,
			errorMsg
		};

		// JSONify
		const jsonToSave = JSON.stringify(stateSnapshot, null, 2);

		// Get formatted date to name download
		const now = new Date().toISOString().replace(/[:.]/g, "-");

		// Format download metadata
		const blob = new Blob([jsonToSave], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		// Invoke download event in browser via DOM
		const a = document.createElement("a");
		a.href = url;
		a.download = `snapshot-${now}.json`;
		a.click();
	}

	// Function for loading saved game state from client computer
	function loadGame(): void {
		// Create DOM instance of input to manipulate
		const input = document.createElement("input");

		// Configure input instance
		input.type = "file";
		input.accept = ".json";

		// Specify onChange handler which grabs state and loads it
		input.onchange = () => {
			// Get file
			const file = input.files?.[0];
			// Do nothing if no file is selected
			if (!file) return;

			// Instantiate filereader
			const reader = new FileReader();

			// Define onLoad function that loads state from json
			reader.onload = () => {
				// Use try catch for error handling
				try {
					const parsed = JSON.parse(reader.result as string);

					setMatrix(parsed.matrix);
					setNextToPlace(parsed.nextToPlace);
					setCellPlacementHistory(parsed.cellPlacementHistory);
					setActiveLevel(parsed.activeLevel);
					setScore(parsed.score);
					setErrorMsg(parsed.errorMsg);
				} catch {
					setErrorMsg("Selected File is Invalid.");
				}
			};

			reader.readAsText(file);
		};

		// Initialize file input diolog
		input.click();
	}

	// Define function for handling error, which, for now, is blank
	function handleError(msg: string): void {
		setErrorMsg(msg);
		playFail();
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
			setCellPlacementHistory([...cellPlacementHistory, [r, c]]);
			playSuccess();
			return;
		}

		// Case where "2" through "25" is being placed
		// Source coordinates of last placed cell
		const lr = cellPlacementHistory[cellPlacementHistory.length - 1][0];
		const lc = cellPlacementHistory[cellPlacementHistory.length - 1][1];

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
			setCellPlacementHistory([...cellPlacementHistory, [r, c]]);
			// Clear "-1" from lvl 2 cells
			setMatrix((prevMatrix) =>
				prevMatrix.map((row) => row.map((v) => (v === -1 ? 0 : v)))
			);
			playSuccess();
			return;
		}

		setNextToPlace((prev) => prev + 1);
		setCellPlacementHistory([...cellPlacementHistory, [r, c]]);
		setErrorMsg(null);
		playSuccess();
	}

	// Define function for processing a move in lvl2 - accepts row column coordinates positionally
	// not touching this - just for architecture
	function processLvl2Move(r: number, c: number, cellType: string): void {
		console.log(r, c, cellType, "Lvl 2 not yet implemented");
	}

	// Define function for undoing a cell placement. Deny undos when next to place is 1.
	function undoCellPlacement() {
		if (nextToPlace > 2) {
			const lastCellPlacement = cellPlacementHistory.pop();
			if (lastCellPlacement) {
				matrix[lastCellPlacement[0]][lastCellPlacement[1]] = 0;
				setMatrix(matrix);
				setNextToPlace((prev) => prev - 1);
			}
		} else {
			handleError("Cannot undo when the last placed number is 1.");
		}
	}

	// Define function for clearing the board, keeping only the 1's placement.
	function clearBoard() {
		const firstCellPlacement = cellPlacementHistory[0];
		setCellPlacementHistory([firstCellPlacement]);
		matrix.length = 0;
		matrix.push(...initialMatrix);
		matrix[firstCellPlacement[0]][firstCellPlacement[1]] = 1;
		setMatrix(matrix);
		setNextToPlace(2);
	}

	// Return Grid of SingleCells, passing corresponding matrix value to each
	return (
		<div className="verticalParent">
			<div className="horizontalParent">
				<ToolbarButton
					label="Save Game"
					onClick={() => saveGame()}
					bgColor="green"
					icon={downloadImg}
				/>
				<ToolbarButton
					label="Load Game"
					onClick={() => loadGame()}
					bgColor="purple"
					icon={uploadImg}
				/>
			</div>
			<div className="horizontalParent">
				<ToolbarButton
					label="Undo"
					onClick={undoCellPlacement}
					bgColor="green"
					icon={""}
				/>
				<ToolbarButton
					label="Clear"
					onClick={clearBoard}
					bgColor="purple"
					icon={""}
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
									cellPlacementHistory.length > 0 &&
									rowCount == cellPlacementHistory[cellPlacementHistory.length - 1][0] &&
									cellCount == cellPlacementHistory[cellPlacementHistory.length - 1][1]
								}
							/>
						);
					})
				)}
			</div>
			<p className="helperText">
				{`Last Cell (debugging): ${cellPlacementHistory[cellPlacementHistory.length -1]}`}
			</p>
			<p className="helperText">
				{`2nd Last Cell (debugging): ${cellPlacementHistory[cellPlacementHistory.length -2]}`}
			</p>
			<p
				className={`errorText ${errorMsg ? "" : "hidden"}`}>{`Error: ${errorMsg}`}</p>
		</div>
	);
};

export default GameBoard;
