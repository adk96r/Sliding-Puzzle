import { useContext, useMemo } from "react";
import * as THREE from "three";
import { SizeContext } from "../../Settings";

export function useTileGeometry(props) {
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
}
