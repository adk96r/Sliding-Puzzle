import "./App.css";
import useTileEngine from "./hooks/useTileEngine";
import cheetah from "./cheetah.jpeg";
import { useTileImages } from "./hooks/useTileImages";
import { Board3D } from "./boards/3D/Board3D";
import { useState } from "react";
import { SizeContext } from "./Settings";

function App(props) {
  const { image = cheetah } = props;

  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(3);

  const tileImages = useTileImages(rows, cols, image);
  const { board, onTilePress } = useTileEngine(rows, cols);
  console.log(board);
  return (
    <>
      <button onClick={() => setRows((rows) => rows + 1)}>Rows-</button>
      <button onClick={() => setCols((cols) => cols + 1)}>Cols+</button>
      <button onClick={() => setRows((rows) => rows - 1)}>Rows-</button>
      <button onClick={() => setCols((cols) => cols - 1)}>Cols-</button>

      <SizeContext.Provider>
        <Board3D
          rows={rows}
          cols={cols}
          tileImages={tileImages}
          board={board}
          onTilePress={onTilePress}
        />
      </SizeContext.Provider>
    </>
  );
}

export default App;
