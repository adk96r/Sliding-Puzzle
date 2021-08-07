import { createContext } from "react";
import Cheetah from "./cheetah.jpeg";

export const size = {
  // Tile
  tileLength: 1,
  tileMargin: 0.1,
  tileDepth: 0.4,
  tileCornerRadius: 0.4,

  // Board
  boardDepth: 0.2,
  boardBorderWidth: 0.4,
  boardInnerCornerRadius: 0.2,
  boardOuterCornerRadius: 0.4,
};

export const theme = {
  tileColor: "#ff4411",
  boardColor: "#ff4411",
};

export const game = {
  rows: 3,
  cols: 3,
  image: Cheetah,
};

export const GameContext = createContext(game);
export const SizeContext = createContext(size);
export const ThemeContext = createContext(theme);
