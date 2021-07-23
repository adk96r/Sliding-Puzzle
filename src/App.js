import "./App.css";
import useTileEngine from "./hooks/useTileEngine";

import { useTileImages } from "./hooks/useTileImages";
import { Board3D } from "./boards/3D/Board3D";
import { game, GameContext, size, SizeContext, theme, ThemeContext } from "./Settings";
import { Canvas } from "react-three-fiber";
import { Controls } from "./boards/3D/controls/Controls";

function App() {
  const { board, onTilePress, shuffle, reset } = useTileEngine();
  const tileImages = useTileImages();

  return (
    <>
      <GameContext.Provider value={game}>
        <SizeContext.Provider value={size}>
          <ThemeContext.Provider value={theme}>
            <Canvas camera={{ position: [0, 0, Math.max(3, 3) * 2] }} shadowMap>
              <Board3D tileImages={tileImages} board={board} onTilePress={onTilePress} />
            </Canvas>
          </ThemeContext.Provider>
        </SizeContext.Provider>
      </GameContext.Provider>
      <Controls shuffle={shuffle} reset={reset} hint={() => {}} />
    </>
  );
}

export default App;
