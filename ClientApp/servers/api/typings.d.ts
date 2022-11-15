declare namespace API {
  type deleteUserDeleteParams = {
    /** 用户ID */
    ID?: string;
  };

  type FormatRes = {
    /** 是否返回成功 */
    success?: boolean;
    /** 返回信息 */
    msg?: string;
    /** 返回数据 */
    data?: any;
  };

  type getUserGetParams = {
    current?: number;
    pageSize?: number;
  };

  type postFaceTranParams = {
    /** 用户ID */
    ID?: string;
    /** 用户名字 */
    UserName?: string;
    /** 用户手机号 */
    Phone?: string;
  };

  type postUserAddImgParams = {
    /** 用户id */
    ID?: string;
    update?: boolean;
  };

  type postUserAddParams = {
    /** 用户ID */
    ID?: string;
    /** 用户名字 */
    UserName?: string;
    /** 用户手机号 */
    Phone?: string;
  };

  type putUserPutParams = {
    /** 用户ID */
    ID?: string;
    /** 用户名字 */
    UserName?: string;
    /** 用户手机号 */
    Phone?: string;
  };
}