import "./App.css";
import { Tile } from "./Tile";
import { useTileImages } from "./useTileImages";
import useTileEngine from "./useTileEngine";
import cheetah from "./cheetah.jpeg";

function App(props) {
  const { rows = 3, cols = 3, image = cheetah } = props;

  const tileImages = useTileImages(image, rows, cols);
  const [board, onTilePressed] = useTileEngine(rows, cols);

  return (
    <>
      <div className="sliding-puzzle-board">
        {tileImages.map((tileImage, index) => {
          return (
            <Tile
              key={index}
              tileIndex={index}
              boardCoords={board.get(index)}
              tileImage={tileImage}
              onTilePress={onTilePressed}
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
