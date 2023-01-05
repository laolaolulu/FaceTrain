import { UploadFile } from 'antd';

declare global {
  //   type UpFace = {
  //     /** 用户ID */
  //     ID: number;
  //     /** 用户名 */
  //     name?: string;
  //     /** 人脸数据url */
  //     urls: UpFaceUrl[];
  //   };

  //   type UpFaceUrl = {
  //     name: string;
  //     url: string;
  //     uid: string;
  //   };
  type UpImg = {
    /** 车库ID */
    ID: number;
    /** 车库名 */
    name?: string;
    /** 车库图片url */
    urls: UploadFile[];
  };
}
