import '@umijs/max/typings';
declare global {
  let cv: any;
  type FaceInfo = {
    id?: number;
    name?: string;
    phone?: string;
    faces?: File[];
  };
}
