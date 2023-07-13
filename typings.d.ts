import '@umijs/max/typings';
declare global {
  const cv: any;
  type FaceInfo = {
    id?: number;
    name?: string;
    phone?: string;
    faces?: File[];
  };
}
