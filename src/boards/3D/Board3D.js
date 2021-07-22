import React, { Suspense, useContext, useMemo } from "react";
import { Canvas, useLoader } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated, config } from "@react-spring/three";
import { DoubleSide, TextureLoader } from "three";
import { SizeContext } from "../../Settings";

const useTileGeometry = (props) => {
  const defaults = useContext(SizeContext);
  const {
    rows = 1,
    cols = 1,
    withBorder = false,
    tileLength,
    tileMargin,
    boardDepth,
    boardBorderWidth,
    boardInnerCornerRadius,
    boardOuterCornerRadius,
  } = { ...defaults, ...props };

  return useMemo(() => {
    const innerHeight = rows * tileLength + tileMargin;
    const innerWidth = cols * tileLength + tileMargin;

    const outerHeight =
      innerHeight + 2 * (boardInnerCornerRadius + boardBorderWidth - boardOuterCornerRadius);
    const outerWidth =
      innerWidth + 2 * (boardInnerCornerRadius + boardBorderWidth - boardOuterCornerRadius);

    const outerOffsetX = outerWidth / 2 + boardOuterCornerRadius;
    const outerOffsetY = outerHeight / 2 + boardOuterCornerRadius;

    // Base backplate & tile
    const shape = new THREE.Shape();
    shape.moveTo(0 - outerOffsetX, boardOuterCornerRadius - outerOffsetY);
    shape.lineTo(0 - outerOffsetX, boardOuterCornerRadius + outerHeight - outerOffsetY);
    shape.bezierCurveTo(
      0 - outerOffsetX,
      outerHeight + 2 * boardOuterCornerRadius - outerOffsetY,
      0 - outerOffsetX,
      outerHeight + 2 * boardOuterCornerRadius - outerOffsetY,
      boardOuterCornerRadius - outerOffsetX,
      outerHeight + 2 * boardOuterCornerRadius - outerOffsetY
    );
    shape.lineTo(
      boardOuterCornerRadius + outerWidth - outerOffsetX,
      outerHeight + 2 * boardOuterCornerRadius - outerOffsetY
    );
    shape.bezierCurveTo(
      outerWidth + 2 * boardOuterCornerRadius - outerOffsetX,
      outerHeight + 2 * boardOuterCornerRadius - outerOffsetY,
      outerWidth + 2 * boardOuterCornerRadius - outerOffsetX,
      outerHeight + 2 * boardOuterCornerRadius - outerOffsetY,
      outerWidth + 2 * boardOuterCornerRadius - outerOffsetX,
      outerHeight + boardOuterCornerRadius - outerOffsetY
    );
    shape.lineTo(
      outerWidth + 2 * boardOuterCornerRadius - outerOffsetX,
      boardOuterCornerRadius - outerOffsetY
    );
    shape.bezierCurveTo(
      outerWidth + 2 * boardOuterCornerRadius - outerOffsetX,
      0 - outerOffsetY,
      outerWidth + 2 * boardOuterCornerRadius - outerOffsetX,
      0 - outerOffsetY,
      outerWidth + boardOuterCornerRadius - outerOffsetX,
      0 - outerOffsetY
    );
    shape.lineTo(boardOuterCornerRadius - outerOffsetX, 0 - outerOffsetY);
    shape.bezierCurveTo(
      0 - outerOffsetX,
      0 - outerOffsetY,
      0 - outerOffsetX,
      0 - outerOffsetY,
      0 - outerOffsetX,
      boardOuterCornerRadius - outerOffsetY
    );

    // For base border
    if (withBorder) {
      const innerOffsetX = innerWidth / 2 + boardInnerCornerRadius;
      const innerOffsetY = innerHeight / 2 + boardInnerCornerRadius;
      const hole = new THREE.Path();
      hole.moveTo(-innerOffsetX, -innerOffsetY + boardInnerCornerRadius);
      hole.lineTo(-innerOffsetX, -innerOffsetY + boardInnerCornerRadius + innerHeight);
      hole.bezierCurveTo(
        -innerOffsetX,
        -innerOffsetY + 2 * boardInnerCornerRadius + innerHeight,
        -innerOffsetX,
        -innerOffsetY + 2 * boardInnerCornerRadius + innerHeight,
        -innerOffsetX + boardInnerCornerRadius,
        -innerOffsetY + 2 * boardInnerCornerRadius + innerHeight
      );
      hole.lineTo(
        -innerOffsetX + boardInnerCornerRadius + innerWidth,
        -innerOffsetY + 2 * boardInnerCornerRadius + innerHeight
      );
      hole.bezierCurveTo(
        -innerOffsetX + 2 * boardInnerCornerRadius + innerWidth,
        -innerOffsetY + 2 * boardInnerCornerRadius + innerHeight,
        -innerOffsetX + 2 * boardInnerCornerRadius + innerWidth,
        -innerOffsetY + 2 * boardInnerCornerRadius + innerHeight,
        -innerOffsetX + 2 * boardInnerCornerRadius + innerWidth,
        -innerOffsetY + boardInnerCornerRadius + innerHeight
      );
      hole.lineTo(
        -innerOffsetX + 2 * boardInnerCornerRadius + innerWidth,
        -innerOffsetY + boardInnerCornerRadius
      );
      hole.bezierCurveTo(
        -innerOffsetX + 2 * boardInnerCornerRadius + innerWidth,
        -innerOffsetY,
        -innerOffsetX + 2 * boardInnerCornerRadius + innerWidth,
        -innerOffsetY,
        -innerOffsetX + boardInnerCornerRadius + innerWidth,
        -innerOffsetY
      );
      hole.lineTo(-innerOffsetX + boardInnerCornerRadius, -innerOffsetY);
      hole.bezierCurveTo(
        -innerOffsetX,
        -innerOffsetY,
        -innerOffsetX,
        -innerOffsetY,
        -innerOffsetX,
        -innerOffsetY + boardInnerCornerRadius
      );

      shape.holes.push(hole);
    }

    const extrudeSettings = {
      depth: boardDepth,
      bevelEnabled: false,
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return geometry;
  }, [
    boardBorderWidth,
    boardDepth,
    boardInnerCornerRadius,
    boardOuterCornerRadius,
    cols,
    rows,
    tileLength,
    tileMargin,
    withBorder,
  ]);
};

function Board(props) {
  const { rows, cols } = props;
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
        <meshLambertMaterial color={"#D65DB1"} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0, dimensions.boardDepth]} geometry={baseBorderGeometry} castShadow>
        <meshLambertMaterial color={"#D65DB1"} side={DoubleSide} />
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

function Tile(props) {
  const { tileIndex, x, y, rows, cols, tileImage, onTilePressed } = props;
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
    <animated.mesh position={position} geometry={geometry} onClick={() => onTilePressed(tileIndex)}>
      <meshStandardMaterial map={texture} attachArray="material" />
      <meshBasicMaterial color="white" attachArray="material" />
    </animated.mesh>
  );
}

function Tiles(props) {
  const { rows, cols, board, onTilePressed, tileImages } = props;

  const tiles = useMemo(
    () =>
      Array.from(board).map(([tileIndex, [x, y]]) => {
        return (
          <Tile
            tileIndex={tileIndex}
            x={x}
            y={y}
            rows={rows}
            cols={cols}
            tileImage={tileImages[tileIndex]}
            onTilePressed={onTilePressed}
          />
        );
      }),
    [board, cols, onTilePressed, rows, tileImages]
  );

  return tiles;
}

export function Board3D(props) {
  const { rows, cols, tileImages, board, onTilePressed } = props;

  if (!tileImages || tileImages.some((image) => !image)) return <div>Loading.</div>;
  return (
    <div className="canvas-container">
      <Suspense fallback={<div>Loading</div>}>
        <Canvas camera={{ position: [0, 0, Math.max(rows, cols) * 2] }} shadowMap>
          <ambientLight intensity={0.5} />
          <pointLight position={[-10, 0, 0]} intensity={0.4} />
          <pointLight position={[10, 0, 0]} intensity={0.4} />
          <pointLight position={[0, 10, 0]} intensity={0.4} />
          <pointLight position={[0, -10, 0]} intensity={0.4} />
          <spotLight position={[0, 0, +10]} intensity={0.3} />
          <pointLight position={[0, 0, -10]} intensity={0.3} />

          <Plane />
          <Board rows={rows} cols={cols} />
          <Tiles
            rows={rows}
            cols={cols}
            board={board}
            onTilePressed={onTilePressed}
            tileImages={tileImages}
          />

          <OrbitControls />
        </Canvas>
      </Suspense>
    </div>
  );
}
