export function Tile(props) {
  const {
    boardCoords: [x, y],
    tileImage,
    tileIndex,
    onTilePress,
  } = props;
  const left = 58 * x;
  const top = 58 * y;

  return (
    <div
      onClick={() => onTilePress(tileIndex)}
      className="sliding-puzzle-tile"
      style={{ left, top, backgroundImage: `url(${tileImage})` }}
    ></div>
  );
}
