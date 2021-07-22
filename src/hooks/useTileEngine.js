import { useCallback, useEffect } from "react";
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
  const [, updateBoard, boardRef] = useStateRef([]);
  const [, updateEmptyTileCoords, emptyTileCoordsRef] = useStateRef([]);
  const [, updateMoves, movesRef] = useStateRef([]);

  useEffect(() => {
    updateBoard(createBoard(numRows, numCols));
    updateEmptyTileCoords([numCols - 1, numRows - 1]);
  }, [numRows, numCols, updateBoard, updateEmptyTileCoords]);

  const getCurrentTileIndexAtInitialIndex = useCallback(
    (initialIndex) => {
      const [x, y] = [initialIndex % numCols, Math.floor(initialIndex / numCols)];
      for (let [key, value] of boardRef.current) {
        if (value[0] === x && value[1] === y) {
          return key;
        }
      }
      return -1;
    },
    [boardRef, numCols]
  );

  const onTilePress = useCallback(
    (tileIndex, shouldLogMove = true) => {
      const [emptyX, emptyY] = emptyTileCoordsRef.current;
      if (!boardRef?.current?.get(tileIndex)) return;

      const [tileX, tileY] = boardRef.current.get(tileIndex);

      // If the clicked tile is beside the empty square, then swap positions
      if (tileY === emptyY || tileX === emptyX) {
        const newBoard = new Map(boardRef.current);
        let nextTileIndex = tileIndex;

        if (tileY === emptyY) {
          // Same row
          const delta = tileX < emptyX ? 1 : -1;
          const tilesToMove = Math.abs(emptyX - tileX);
          for (let i = 0; i < tilesToMove; i++) {
            const newCoords = [newBoard.get(nextTileIndex)[0] + delta, emptyY];
            newBoard.set(nextTileIndex, newCoords);
            nextTileIndex = getCurrentTileIndexAtInitialIndex(
              newCoords[0] + numCols * newCoords[1]
            );
          }
        } else if (tileX === emptyX) {
          // Same column
          const delta = tileY < emptyY ? 1 : -1;
          const tilesToMove = Math.abs(emptyY - tileY);
          for (let i = 0; i < tilesToMove; i++) {
            const newCoords = [emptyX, newBoard.get(nextTileIndex)[1] + delta];
            newBoard.set(nextTileIndex, newCoords);
            nextTileIndex = getCurrentTileIndexAtInitialIndex(
              newCoords[0] + numCols * newCoords[1]
            );
          }
        }

        updateBoard(newBoard);
        updateEmptyTileCoords([tileX, tileY]);
        if (shouldLogMove) updateMoves([tileIndex, ...movesRef.current]);
      }
    },
    [
      emptyTileCoordsRef,
      boardRef,
      updateBoard,
      updateEmptyTileCoords,
      updateMoves,
      movesRef,
      getCurrentTileIndexAtInitialIndex,
      numCols,
    ]
  );

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
    onTilePress(index);
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
      onTilePress(lastMoveTileIndex, false);
      updateMoves(movesRef.current.slice(1));
    }, 10);
  };

  // Dont expose complete board
  return { board: boardRef.current, onTilePress, shuffle, reset };
}
