import { createContext } from "react";

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
  tileColor: "#222222",
  boardColor: "#444444",
};

export const game = {
  rows: 3,
  cols: 3,
  image:
    "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/aloe-vera-plant-1522874831.jpg",
};

export const GameContext = createContext(game);
export const SizeContext = createContext(size);
export const ThemeContext = createContext(theme);
