import "./App.css";
import useTileEngine from "./hooks/useTileEngine";
import cheetah from "./cheetah.jpeg";
import { useTileImages } from "./hooks/useTileImages";
import { Board3D } from "./boards/3D/Board3D";
import { useEffect } from "react";
import { SizeContext } from "./Settings";

function App(props) {
  const { rows = 3, cols = 3, image = cheetah } = props;

  const tileImages = useTileImages(rows, cols, image);
  const { board, onTilePressed, shuffle, reset } = useTileEngine(rows, cols);
  useEffect(() => {
    console.log("Board changed");
  }, [board]);
  return (
    <>
      <button onClick={() => shuffle(100)}>Shuffle!</button>
      <button onClick={() => reset()}>Reset!</button>

      <SizeContext.Provider>
        <Board3D
          rows={rows}
          cols={cols}
          tileImages={tileImages}
          board={board}
          onTilePressed={onTilePressed}
        />
      </SizeContext.Provider>
    </>
  );
}

export default App;
