import { useCallback, useState } from "react";

// Creates a board, essentially a Map that stores the
// coordinates of each tile on the board. Horizontal
// axis is x. Vertical axis downwards is y.
function createBoard(numRows, numCols) {
  const map = new Map();
  for (let y = 0, tile = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      if (y === numRows - 1 && x === numCols - 1) continue;
      map.set(tile++, [x, y]);
    }
  }
  return map;
}

export default function useTileEngine(numRows, numCols, options = {}) {
  const [board, updateBoard] = useState(createBoard(numRows, numCols));
  const [emptyTileCoords, updateEmptyTileCoords] = useState([numCols - 1, numRows - 1]);
  const { debug = true } = options;

  const onTilePressed = useCallback(
    (tileIndex) => {
      const [tileX, tileY] = board.get(tileIndex);
      const [emptyX, emptyY] = emptyTileCoords;

      if (debug) {
        console.log("Tile pressed", tileIndex);
        console.log("Tile  coords", tileX, tileY);
        console.log("Empty coords", emptyX, emptyY);
        console.log("Old board", board);
      }

      // If the clicked tile is beside the empty square, then swap positions
      if (
        (tileY === emptyY && Math.abs(tileX - emptyX) === 1) || // Same row
        (tileX === emptyX && Math.abs(tileY - emptyY) === 1) // Same column
      ) {
        const newBoardCoords = new Map(board);
        newBoardCoords.set(tileIndex, [emptyX, emptyY]);
        updateBoard(newBoardCoords);
        updateEmptyTileCoords([tileX, tileY]);

        if (debug) {
          console.log("Tile pressed", tileIndex);
          console.log("New tile  coords", emptyX, emptyY);
          console.log("New empty coords", tileX, tileY);
          console.log("New board", newBoardCoords);
        }
      } else {
        if (debug) console.log("No op");
      }
    },
    [board, emptyTileCoords]
  );

  // Dont expose complete board
  return [board, onTilePressed];
}
