import { createContext } from "react";

const size = {
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

const theme = {
  tileColor: "#ffffff",
  boardColor: "#ff4411",
};

export const SizeContext = createContext(size);
export const ThemeContext = createContext(theme);
