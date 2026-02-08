# Project Title

Diagonal Counting Game - Group 2

## Techstack

For now, the entire app is built in React (TypeScript) and styled with vanilla CSS.

The app is hosted on Vercel.

## How to run

- Option A: Access the deployment at [https://diagonal-counting-game.vercel.app/]

- Option B: Run locally
    - Ensure you have installed a recent version of Node.js and Node Package Manager (npm)
    - Navigate to the root directory
    - run "npm install" to install dependencies
    - run "npm run dev" to launch the app on localhost

## Components / Source Code Files

- GameBoard (./src/GameBoard):
    - GameBoard.tsx defines all of the internal state and methods used to implement the game, and will be instantiated exactly once per connection to the website. It tracks the current matrix, score, and move history, as well processes the validity of moves with error handling. This is the highest level component we define, as the injection point (./src/App.tsx) simply renders one GameBoard.

    - GameBoard.css defines all of the styling for the GameBoard, both aesthetically and functionally. This contains a lot of flexbox and grid logic, which ensures that our game can be displayed on a single screen, and that all 49 SingleCells are displayed together.

    - helpers.ts is a static file that defines functions and objects that are required by the GameBoard, but are able to be set up seprately. This includes the sound effects, as well as general logic functions like deep copying an array or generating a random integer.

- SingleCell (./src/SingleCell):
    - SingleCell.tsx defines a prop interface and event handling infrastructure needed to represent one of the 49 spots on the GameBoard. This is a CONTROLLED component, which means that all of the logic (including the onClick function itself) is defined in GameBoard, and passed to SingleCell via props. A SingleCell is encoded with it's indices and cellType (grey, blue, or gold), where that information is passed to the onClick when it is invoked.

    - SingleCell.css defines the classes used to ensure that SingleCells visually represent their type, and their behavior when rendered alongside eachother (no margin or gaps between them).

- ToolbarButton (./src/ToolbarButton):
    - ToolbarButton.tsx defines a prop interface and event handling infrastructure needed to add a general feature to the gameboard. It accepts a label, (optional) icon, and onClick function to make a visual interface for users to activate a method defined in GameBoard. As is, we instantiate 4 for load, save, undo, and clear functionalities in accordance with the first batch of user stories.

    - ToolbarButton.css defines classes to ensure the placement and scaling of label and icon are proportional.
