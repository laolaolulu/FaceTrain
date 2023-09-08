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
    modelID: number;
    time: number;
    faces: (FaceRect & {
      face: string;
    })[];
  };
  type DetectionDataType = {
    imgID: number;
    name: string;
    size: number;
    model?: DetectionModel[];
  };
  type DetectionRes = {
    success: boolean;
    imgID: number;
    data: { faces: FaceRect[]; time: number };
  };
}
