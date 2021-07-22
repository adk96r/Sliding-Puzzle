import { animated, config, useSpring } from "@react-spring/three";
import { Suspense, useContext, useMemo } from "react";
import { useLoader } from "react-three-fiber";
import { TextureLoader } from "three";
import { SizeContext } from "../../Settings";
import { useTileGeometry } from "./useTileGeometry";

export function Tile(props) {
  const { tileIndex, x, y, rows, cols, tileImage, onTilePress } = props;
  const { tileLength, tileMargin, boardDepth } = useContext(SizeContext);
  const geometryProps = {
    rows: 1,
    cols: 1,
    withBorder: false,
    tileMargin: 0,
    boardBorderWidth: 0,
    boardInnerCornerRadius: 0,
    boardOuterCornerRadius: 0.2,
  };
  const geometry = useTileGeometry({ ...geometryProps });
  const [offsetX, offsetY] = useMemo(() => {
    const midX = cols % 2 === 0 ? (cols - 1) / 2 : Math.floor(cols / 2);
    const midY = rows % 2 === 0 ? (rows - 1) / 2 : Math.floor(rows / 2);
    const offsetX = (x - midX) * (tileLength + tileMargin);
    const offsetY = (midY - y) * (tileLength + tileMargin);
    return [offsetX, offsetY];
  }, [cols, rows, tileLength, tileMargin, x, y]);

  const { position } = useSpring({
    position: [offsetX, offsetY, boardDepth],
    config: config.stiff,
  });

  const texture = useLoader(TextureLoader, tileImage);
  texture.repeat.set(1 / tileLength, 1 / tileLength);
  texture.offset.set(0.5, 0.5);

  return (
    <Suspense fallback={"Hello"}>
      <animated.mesh position={position} geometry={geometry} onClick={() => onTilePress(tileIndex)}>
        <meshStandardMaterial map={texture} attachArray="material" />
        <meshBasicMaterial color="white" attachArray="material" />
      </animated.mesh>
    </Suspense>
  );
}
