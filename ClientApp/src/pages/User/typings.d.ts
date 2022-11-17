declare namespace API {
  type UpFace = {
    /** 用户ID */
    ID: string;
    /** 用户名 */
    name?: string;
    /** 人脸数据url */
    urls: UpFaceUrl[];
  };

  type UpFaceUrl = {
    name: string;
    url: string;
    uid: string;
  };
}
