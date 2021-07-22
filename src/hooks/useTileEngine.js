import { useCallback } from "react";
import useStateRef from "react-usestateref";

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

export default function useTileEngine(numRows, numCols) {
  const [board, updateBoard, boardRef] = useStateRef(createBoard(numRows, numCols));
  const [_, updateEmptyTileCoords, emptyTileCoordsRef] = useStateRef([numCols - 1, numRows - 1]);
  const [__, updateMoves, movesRef] = useStateRef([]);

  const onTilePressed = useCallback(
    (tileIndex, shouldUpdateMoves = true) => {
      const [emptyX, emptyY] = emptyTileCoordsRef.current;

      const tileCoords = boardRef.current.get(tileIndex);
      if (!tileCoords) return;

      const [tileX, tileY] = tileCoords;

      // If the clicked tile is beside the empty square, then swap positions
      if (
        (tileY === emptyY && Math.abs(tileX - emptyX) === 1) || // Same row
        (tileX === emptyX && Math.abs(tileY - emptyY) === 1) // Same column
      ) {
        const newBoardCoords = new Map(boardRef.current);
        newBoardCoords.set(tileIndex, [emptyX, emptyY]);
        updateBoard(newBoardCoords);
        updateEmptyTileCoords([tileX, tileY]);
        if (shouldUpdateMoves) updateMoves([tileIndex, ...movesRef.current]);
      }
    },
    [boardRef, movesRef, emptyTileCoordsRef, updateBoard, updateMoves, updateEmptyTileCoords]
  );

  const getCurrentTileIndexAtInitialIndex = (initialIndex) => {
    const [x, y] = [initialIndex % numCols, Math.floor(initialIndex / numCols)];
    for (let [key, value] of boardRef.current) {
      if (value[0] === x && value[1] === y) {
        return key;
      }
    }
    return -1;
  };

  const makeRandomMove = () => {
    const [emptyX, emptyY] = emptyTileCoordsRef.current;
    const emptyIndex = emptyX + emptyY * numCols;
    let possibleMoves = [];

    if (emptyX + 1 < numCols) possibleMoves.push(emptyIndex + 1);
    if (emptyX - 1 >= 0) possibleMoves.push(emptyIndex - 1);
    if (emptyY + 1 < numRows) possibleMoves.push(emptyIndex + numCols);
    if (emptyY - 1 >= 0) possibleMoves.push(emptyIndex - numCols);

    possibleMoves = possibleMoves.map((move) => getCurrentTileIndexAtInitialIndex(move));

    // Find a move which hasn't been done in the last-n moves.
    const index = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    onTilePressed(index);
  };

  const shuffle = (maxMoves) => {
    let numMoves = 0;
    const interval = setInterval(() => {
      if (numMoves++ === maxMoves) clearInterval(interval);
      else makeRandomMove();
    }, 10);
  };

  const reset = () => {
    const interval = setInterval(() => {
      if (movesRef.current.length === 0) clearInterval(interval);
      const lastMoveTileIndex = movesRef.current[0];
      onTilePressed(lastMoveTileIndex, false);
      updateMoves(movesRef.current.slice(1));
    }, 10);
  };

  // Dont expose complete board
  return { board, onTilePressed, shuffle, reset };
}
