import { useEffect, useState } from "react";

export function useTileImages(rows, cols, imageSrc) {
  const [tileImages, setTileImages] = useState([]);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      const tileImages = diceImage(image, rows, cols);
      setTileImages(tileImages);
    };
    image.src = imageSrc;
  }, [imageSrc, rows, cols]);

  return tileImages;
}

function diceImage(image, rows, cols) {
  const side = Math.floor(Math.min(image.width, image.height) / Math.max(rows, cols));
  const tileImages = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === rows - 1 && c === cols - 1) continue;
      const canvas = document.createElement("canvas");
      canvas.width = side;
      canvas.height = side;
      const context = canvas.getContext("2d");
      context.drawImage(image, c * side, r * side, side, side, 0, 0, canvas.width, canvas.height);
      tileImages.push(canvas.toDataURL());
    }
  }

  return tileImages;
}
