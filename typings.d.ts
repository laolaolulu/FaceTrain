import '@umijs/max/typings';
declare global {
  let cv: any;
  type FaceInfo = {
    id?: number;
    name?: string;
    phone?: string;
    faces?: File[];
  };

  type FaceRect = { height: number; width: number; x: number; y: number };
  type DetectionModel = {
    index: number;
    time: number;
    faces: (FaceRect & {
      face: string;
    })[];
  };
  type DetectionDataType = {
    index: number;
    name: string;
    size: number;
    model: DetectionModel[];
  };
}
