import React, { Suspense, useContext, useMemo } from "react";
import { DoubleSide } from "three";
import { GameContext, SizeContext, ThemeContext } from "../../Settings";
import { useTileGeometry } from "./useTileGeometry";
import { Tile } from "./Tile";
import { OrbitControls } from "@react-three/drei";

function Board(props) {
  const { rows, cols } = props;
  const { boardColor } = useContext(ThemeContext);
  const dimensions = useContext(SizeContext);
  const baseGeometry = useTileGeometry({ ...dimensions, rows: rows, cols: cols });
  const baseBorderGeometry = useTileGeometry({
    ...dimensions,
    rows: rows,
    cols: cols,
    withBorder: true,
  });

  return (
    <>
      <mesh position={[0, 0, 0]} geometry={baseGeometry} castShadow>
        <meshLambertMaterial color={boardColor} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0, dimensions.boardDepth]} geometry={baseBorderGeometry} castShadow>
        <meshLambertMaterial color={boardColor} side={DoubleSide} />
      </mesh>
    </>
  );
}

function Tiles(props) {
  const { rows, cols, board, onTilePress, tileImages } = props;

  const tiles = useMemo(() => {
    return tileImages.map((imageData, tileIndex) => {
      if (!board.get(tileIndex)) return null;
      return (
        <Tile
          key={tileIndex}
          tileIndex={tileIndex}
          x={board.get(tileIndex)[0]}
          y={board.get(tileIndex)[1]}
          rows={rows}
          cols={cols}
          tileImage={imageData}
          onTilePress={onTilePress}
        />
      );
    });
  }, [board, cols, onTilePress, rows, tileImages]);

  return tiles;
}

export function Board3D(props) {
  const { rows, cols } = useContext(GameContext);
  const { tileImages, board, onTilePress } = props;

  if (!tileImages || tileImages.some((image) => !image)) return <div>Loading</div>;
  return (
    <Suspense fallback={"Loading board"}>
      <ambientLight intensity={0.5} />
      <pointLight position={[-10, 0, 5]} intensity={0.3} />
      <pointLight position={[10, 0, 5]} intensity={0.3} />
      <pointLight position={[0, 10, 5]} intensity={0.3} />
      <pointLight position={[0, -10, 5]} intensity={0.3} />
      <spotLight position={[0, 0, +10]} intensity={1.5} />
      <pointLight position={[0, 0, -10]} intensity={0.1} />

      <Board rows={rows} cols={cols} />
      <Suspense fallback={"Loading tiles"}>
        <Tiles
          rows={rows}
          cols={cols}
          board={board}
          onTilePress={onTilePress}
          tileImages={tileImages}
        />
      </Suspense>

      <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
    </Suspense>
  );
}
