declare namespace API {
  type User = {
    /** 用户ID */
    id: string;
    /** 用户名字 */
    userName?: string;
    /** 用户手机号 */
    phone?: string;
    /** 用户脸照片 */
    faces?: string[];
  };
}
