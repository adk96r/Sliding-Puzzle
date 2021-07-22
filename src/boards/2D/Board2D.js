import { animated, config, useSpring } from "react-spring";

function Tile(props) {
  const {
    boardCoords: [x, y],
    tileImage,
    tileIndex,
    onTilePress,
  } = props;

  const styles = useSpring({
    to: {
      left: 58 * x,
      top: 58 * y,
    },
    config: config.stiff,
  });

  return (
    <animated.div
      onClick={() => onTilePress(tileIndex)}
      className="sliding-puzzle-tile"
      style={{ ...styles, backgroundImage: `url(${tileImage})` }}
    ></animated.div>
  );
}

export function Board2D(props) {
  const { board, tileImages, onTilePressed } = props;

  return (
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
  );
}
