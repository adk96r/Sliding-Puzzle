import { useCallback, useContext, useEffect } from "react";
import useStateRef from "react-usestateref";
import { GameContext } from "../Settings";

// Creates a board, essentially a Map that stores the
// coordinates of each tile on the board. Horizontal
// axis is x. Vertical axis downwards is y.
function createBoard(rows, cols) {
  const map = new Map();
  for (let y = 0, tile = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (y === rows - 1 && x === cols - 1) continue;
      map.set(tile++, [x, y]);
    }
  }
  return map;
}

export default function useTileEngine() {
  const { rows, cols } = useContext(GameContext);
  const [, updateBoard, boardRef] = useStateRef([]);
  const [, updateEmptyTileCoords, emptyTileCoordsRef] = useStateRef([]);
  const [, updateMoves, movesRef] = useStateRef([]);

  useEffect(() => {
    updateBoard(createBoard(rows, cols));
    updateEmptyTileCoords([cols - 1, rows - 1]);
  }, [rows, cols, updateBoard, updateEmptyTileCoords]);

  const getCurrentTileIndexAtInitialIndex = useCallback(
    (initialIndex) => {
      const [x, y] = [initialIndex % cols, Math.floor(initialIndex / cols)];
      for (let [key, value] of boardRef.current) {
        if (value[0] === x && value[1] === y) {
          return key;
        }
      }
      return -1;
    },
    [boardRef, cols]
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
            nextTileIndex = getCurrentTileIndexAtInitialIndex(newCoords[0] + cols * newCoords[1]);
          }
        } else if (tileX === emptyX) {
          // Same column
          const delta = tileY < emptyY ? 1 : -1;
          const tilesToMove = Math.abs(emptyY - tileY);
          for (let i = 0; i < tilesToMove; i++) {
            const newCoords = [emptyX, newBoard.get(nextTileIndex)[1] + delta];
            newBoard.set(nextTileIndex, newCoords);
            nextTileIndex = getCurrentTileIndexAtInitialIndex(newCoords[0] + cols * newCoords[1]);
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
      cols,
    ]
  );

  const makeRandomMove = () => {
    const [emptyX, emptyY] = emptyTileCoordsRef.current;
    const emptyIndex = emptyX + emptyY * cols;
    let possibleMoves = [];

    if (emptyX + 1 < cols) possibleMoves.push(emptyIndex + 1);
    if (emptyX - 1 >= 0) possibleMoves.push(emptyIndex - 1);
    if (emptyY + 1 < rows) possibleMoves.push(emptyIndex + cols);
    if (emptyY - 1 >= 0) possibleMoves.push(emptyIndex - cols);

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
    }, 20);
  };

  const reset = () => {
    const interval = setInterval(() => {
      if (movesRef.current.length === 0) clearInterval(interval);
      const lastMoveTileIndex = movesRef.current[0];
      onTilePress(lastMoveTileIndex, false);
      updateMoves(movesRef.current.slice(1));
    }, 200);
  };

  // Dont expose complete board
  return { board: boardRef.current, onTilePress, shuffle, reset };
}
