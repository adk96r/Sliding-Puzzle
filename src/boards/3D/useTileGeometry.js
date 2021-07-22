import { useMemo } from "react";
import * as THREE from "three";

export function useTileGeometry(props) {
  const { dimensions: { sideLength, borderRadius, depth } = {} } = props;

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, borderRadius);
    shape.lineTo(0, sideLength - borderRadius);
    shape.bezierCurveTo(0, sideLength, 0, sideLength, borderRadius, sideLength);
    shape.lineTo(sideLength - borderRadius, sideLength);
    shape.bezierCurveTo(
      sideLength,
      sideLength,
      sideLength,
      sideLength,
      sideLength,
      sideLength - borderRadius
    );
    shape.lineTo(sideLength, borderRadius);
    shape.bezierCurveTo(sideLength, 0, sideLength, 0, sideLength - borderRadius, 0);
    shape.lineTo(borderRadius, 0);
    shape.bezierCurveTo(0, 0, 0, 0, 0, borderRadius);

    const extrudeSettings = {
      steps: 20,
      depth: depth,
      bevelEnabled: false,
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    console.log("Inside", geometry);
    return geometry;
  }, [borderRadius, depth, sideLength]);

  return geometry;
}
