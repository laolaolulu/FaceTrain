declare namespace API {
  type deleteFaceDeleteParams = {
    fileName?: string;
  };

  type deleteUserDeleteParams = {
    /** 用户ID */
    ID?: number;
  };

  type deleteUserDelFaceParams = {
    ID?: number;
  };

  type getUserGetParams = {
    current?: number;
    pageSize?: number;
  };

  type postFacePredictParams = {
    model?: string;
  };

  type postFaceTrainParams = {
    type?: string;
  };

  type postUserAddImgParams = {
    /** 用户id */
    ID?: number;
    update?: boolean;
  };

  type Res = {
    /** 是否返回成功 */
    success: boolean;
    /** 返回信息 */
    msg?: string;
  };

  type StringIEnumerableInt32ValueTuple = true;

  type StringIEnumerableInt32ValueTupleRes = {
    /** 是否返回成功 */
    success: boolean;
    /** 返回信息 */
    msg?: string;
    data?: StringIEnumerableInt32ValueTuple;
  };

  type UserInfo = {
    /** 用户ID */
    id: number;
    /** 用户名字 */
    userName?: string;
    /** 用户手机号 */
    phone?: string;
    /** 人脸图片url */
    faces: string[];
  };

  type UserInfoIEnumerableInt32ValueTuple = true;

  type UserInfoIEnumerableInt32ValueTupleRes = {
    /** 是否返回成功 */
    success: boolean;
    /** 返回信息 */
    msg?: string;
    data?: UserInfoIEnumerableInt32ValueTuple;
  };
}
