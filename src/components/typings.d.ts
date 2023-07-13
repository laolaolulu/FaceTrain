type NameFaces = {
  name: string;
  faces: { file: File; x: number; y: number }[];
  ctx?: CanvasRenderingContext2D | null;
};
