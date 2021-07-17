import { animated, config, useSpring } from "react-spring";

export function Tile(props) {
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
