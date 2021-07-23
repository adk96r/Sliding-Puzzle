import React, { Suspense, useContext, useMemo } from "react";
import * as THREE from "three";
import { DoubleSide } from "three";
import { GameContext, SizeContext, ThemeContext } from "../../Settings";
import { useTileGeometry } from "./useTileGeometry";
import { Tile } from "./Tile";
import { Canvas } from "react-three-fiber";
import { Controls } from "./controls/Controls";
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

function Plane() {
  return useMemo(() => {
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    return (
      <mesh
        geometry={planeGeometry}
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -4, 0]}
      >
        <meshPhongMaterial color={"white"} depthWrite={false} />
      </mesh>
    );
  }, []);
}

function Tiles(props) {
  const { rows, cols, board, onTilePress, tileImages } = props;

  const tiles = useMemo(() => {
    return tileImages.map((imageData, tileIndex) => {
      if (!board.get(tileIndex)) return null;
      return (
        <Tile
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
      <pointLight position={[-10, 0, 0]} intensity={0.4} />
      <pointLight position={[10, 0, 0]} intensity={0.4} />
      <pointLight position={[0, 10, 0]} intensity={0.4} />
      <pointLight position={[0, -10, 0]} intensity={0.4} />
      <spotLight position={[0, 0, +10]} intensity={0.3} />
      <pointLight position={[0, 0, -10]} intensity={0.3} />

      <Plane />
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
