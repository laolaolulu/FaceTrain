declare namespace API1 {
  type deleteFaceDelModelParams = {
    fileName: string;
  };

  type deleteFaceDelParams = {
    ID: number;
  };

  type deleteUserDelParams = {
    /** 用户ID */
    ID: number;
  };

  type getUserGetParams = {
    current?: number;
    pageSize?: number;
  };

  type postUserAddImgParams = {
    /** 用户id */
    ID: number;
    update?: boolean;
  };

  type PredictRes = {
    name: string;
    label: number;
    confidence: number;
    msg: string;
  };

  type putFacePredictParams = {
    model?: string;
  };

  type putFaceTrainParams = {
    type?: string;
  };

  type UserInfo = {
    /** 用户ID */
    id: number;
    /** 用户名字 */
    userName?: string;
    /** 用户手机号 */
    phone?: string;
    /** 人脸图片url */
    faces?: string[];
  };

  type UserInfoResPage = {
    /** 分页总行数 */
    total: number;
    /** 分页数据集合 */
    list: UserInfo[];
  };
}
