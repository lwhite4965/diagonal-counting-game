import successSfx from "../assets/placementSuccess.mp3";
import failureSfx from "../assets/placementFail.mp3";
import victorySfx from "../assets/victory.mp3"

// Create audio objects for each sfx
const successAudio = new Audio(successSfx);
const failAudio = new Audio(failureSfx);
const victoryAudio = new Audio(victorySfx);

export function playSuccess() {
	successAudio.currentTime = 0;
	successAudio.play();
}

export function playFail() {
	failAudio.currentTime = 0;
	failAudio.play();
}

export function playVictory() {
	victoryAudio.currentTime = 0;
	victoryAudio.play();
}

// Define arrays to hold incides of blue and gold cells
const goldCells = [0, 6, 42, 48];
const blueCells = [
	1, 2, 3, 4, 5, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 43, 44, 45, 46, 47
];

// Generate random integer in range
export function getRandomInteger(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Define function that accepts matrix loop # and returns bg color
export function getCellType(loop: number): "grey" | "blue" | "gold" {
	if (goldCells.indexOf(loop) != -1) {
		return "gold";
	}
	if (blueCells.indexOf(loop) != -1) {
		return "blue";
	}
	return "grey";
}
